"use server";

import { db } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { getCurrentUser } from "./auth.action"; // Your user authentication action

// Placeholder for your actual AI API call.
async function callAIToGenerateQuestions(prompt: string): Promise<string[]> {
  // Replace this with your call to the Gemini or OpenAI API.
  // Example:
  // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  // ...
  const mockApiResponse = JSON.stringify([
    `Tell me about a challenging project from your experience.`,
    "How do you handle constructive feedback from a senior developer?",
    `Explain a complex technical concept you recently learned.`,
    "Describe a time you had to adapt to a major change in a project.",
    "What are your long-term career aspirations?"
  ]);
  return JSON.parse(mockApiResponse);
}

interface FormData {
  role: string;
  level: string;
  techStack: string;
  type: string;
  amount: number;
}

export async function generateAndSaveInterview(
  formData: FormData
): Promise<{ interviewId?: string; questions?: string[]; error?: string }> {
  const { role, level, techStack, type, amount } = formData;
  
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("You must be logged in to create an interview.");
    }

    const prompt = `Prepare ${amount} interview questions for a ${level} ${role} with experience in ${techStack}. The focus should be ${type}. Return questions as a JSON array of strings without any special characters like '*' or '/'.`;
    const questions = await callAIToGenerateQuestions(prompt);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("AI failed to generate valid questions.");
    }

    const newInterview = {
      userId: user.id,
      role,
      level,
      techStack: techStack.split(',').map(t => t.trim()),
      type,
      questions,
      createdAt: FieldValue.serverTimestamp(),
    };

    // Use the correct Firebase Admin SDK syntax
    const docRef = await db.collection("interviews").add(newInterview);

    return { interviewId: docRef.id, questions };
  } catch (error: any) {
    console.error("Error creating interview:", error);
    return { error: error.message || "Failed to create the interview." };
  }
}