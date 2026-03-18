"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { FieldValue } from "firebase-admin/firestore";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

type FirestoreDateLike = { toDate: () => Date };

const isFirestoreDateLike = (value: unknown): value is FirestoreDateLike =>
  typeof value === "object" &&
  value !== null &&
  "toDate" in value &&
  typeof (value as FirestoreDateLike).toDate === "function";

const normalizeFirestoreDate = (value: unknown) =>
  isFirestoreDateLike(value) ? value.toDate().toISOString() : value;

const mapInterviewDoc = (doc: FirebaseFirestore.QueryDocumentSnapshot) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    techstack: data.techstack ?? data.techStack ?? [],
    createdAt: normalizeFirestoreDate(data.createdAt),
  } as Interview;
};

const isMissingIndexError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: number }).code === 9;

/* ── Model fallback chain — lite has highest free-tier quota ── */
const GEMINI_MODELS = [
  "gemini-2.0-flash-lite",   // best free-tier RPM + RPD
  "gemini-1.5-flash-8b",     // smallest 1.5 model, very generous quota
  "gemini-2.0-flash",        // full model, lowest free quota
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function generateWithFallback(prompt: string, system: string): Promise<string> {
  let lastError: unknown;

  for (const modelId of GEMINI_MODELS) {
    try {
      const { text } = await generateText({
        model: google(modelId),
        prompt,
        system,
      });
      return text;
    } catch (err: unknown) {
      lastError = err;
      const status =
        err &&
        typeof err === "object" &&
        "statusCode" in err
          ? (err as { statusCode: number }).statusCode
          : 0;

      if (status === 429) {
        /* quota hit — wait 5 s then try next model */
        console.warn(`[AI] quota hit on ${modelId}, trying fallback...`);
        await wait(5000);
        continue;
      }
      /* non-quota error — fail fast, don't try next model */
      throw err;
    }
  }

  throw lastError;
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const text = await generateWithFallback(
      `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Return ONLY valid JSON (no markdown, no code fences) using this exact shape:
        {
          "totalScore": number,
          "categoryScores": [
            { "name": "Communication Skills", "score": number, "comment": string },
            { "name": "Technical Knowledge", "score": number, "comment": string },
            { "name": "Problem Solving", "score": number, "comment": string },
            { "name": "Cultural Fit", "score": number, "comment": string },
            { "name": "Confidence and Clarity", "score": number, "comment": string }
          ],
          "strengths": string[],
          "areasForImprovement": string[],
          "finalAssessment": string
        }
        `,
      "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories"
    );

    const normalizedText = text
      .replace(/```json|```/g, "")
      .trim()
      .replace(/^[\s\S]*(\{)/, "$1")
      .replace(/(\})[\s\S]*$/, "$1");
    const object = feedbackSchema.parse(JSON.parse(normalizedText));

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: FieldValue.serverTimestamp(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);
    await db.collection("interviews").doc(interviewId).set(
      {
        finalized: true,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);

    /* Distinguish quota errors for a friendlier message */
    const isQuota =
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      (error as { statusCode: number }).statusCode === 429;

    return {
      success: false,
      error: isQuota
        ? "AI quota exceeded. Please wait a minute and try again — or add billing to your Google AI account."
        : "Failed to generate feedback report.",
    };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interviewRef = db.collection("interviews").doc(id);
  const interview = await interviewRef.get();

  // IMPROVEMENT: Check if the document exists and include its ID in the return value
  if (!interview.exists) {
    return null;
  }
  
  const data = interview.data();
  return {
    id: interview.id,
    ...data,
    techstack: data?.techstack ?? data?.techStack ?? [],
    createdAt: normalizeFirestoreDate(data?.createdAt),
  } as Interview;
}

// No changes needed below this line, your other functions look great.

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  const data = feedbackDoc.data();
  return {
    id: feedbackDoc.id,
    ...data,
    createdAt: normalizeFirestoreDate(data.createdAt),
  } as Feedback;
}

export async function getFeedbackByUserId(
  userId?: string
): Promise<Record<string, Feedback>> {
  if (!userId) return {};

  const querySnapshot = await db
    .collection("feedback")
    .where("userId", "==", userId)
    .get();

  return querySnapshot.docs.reduce<Record<string, Feedback>>((acc, doc) => {
    const data = doc.data();
    const feedback = {
      id: doc.id,
      ...data,
      createdAt: normalizeFirestoreDate(data.createdAt),
    } as Feedback;

    acc[feedback.interviewId] = feedback;
    return acc;
  }, {});
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[]> {
  const { limit = 20 } = params;

  let interviews: FirebaseFirestore.QuerySnapshot;
  try {
    interviews = await db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
  } catch (error) {
    if (!isMissingIndexError(error)) throw error;

    interviews = await db
      .collection("interviews")
      .limit(limit * 3)
      .get();
  }

  const mappedInterviews = interviews.docs
    .map(mapInterviewDoc)
    .sort(
      (a, b) =>
        (Date.parse(String(b.createdAt ?? "")) || 0) -
        (Date.parse(String(a.createdAt ?? "")) || 0)
    );

  return mappedInterviews.slice(0, limit);
}

export async function getInterviewsByUserId(
  userId?: string
): Promise<Interview[]> {
  if (!userId) return [];

  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map(mapInterviewDoc);
}
