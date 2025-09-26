"use server";

// You will need to install and set up your preferred AI SDK
// For example, with Google's Generative AI:
// import { GoogleGenerativeAI } from "@google/generative-ai";

interface FormData {
  role: string;
  level: string;
  techStack: string;
  type: string;
  amount: number;
}

export async function generateInterviewQuestions(
  formData: FormData
): Promise<{ questions?: string[]; error?: string }> {
  const { role, level, techStack, type, amount } = formData;

  // Construct the prompt based on the user's template
  const prompt = `
    Prepare questions for a job interview.
    The job role is ${role}.
    The job experience level is ${level}.
    The tech stack used in the job is: ${techStack}.
    The focus between behavioural and technical questions should lean towards: ${type}.
    The amount of questions required is: ${amount}.
    Please return only the questions, without any additional text.
    The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
    Return the questions formatted like this:
    ["Question 1", "Question 2", "Question 3"]

    Thank you! <3
  `;

  try {
    // --- AI PROVIDER LOGIC GOES HERE ---
    // This is a placeholder. Replace this with your actual AI API call.
    // Example with Google's Generative AI SDK:
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // const result = await model.generateContent(prompt);
    // const response = await result.response;
    // const text = response.text();
    
    // For demonstration, we'll use a mock response.
    // In a real app, 'text' would come from the AI call above.
    const mockApiResponse = JSON.stringify([
        `Tell me about a challenging project you worked on using ${techStack.split(',')[0].trim()}.`,
        "How do you handle disagreements with a team member?",
        `Explain the concept of state management in ${role === 'Frontend Developer' ? 'React' : 'a backend application'}.`,
        "Describe a time you had to learn a new technology quickly.",
        "What are your long-term career goals as a developer?"
    ]);
    
    // --- END OF AI PROVIDER LOGIC ---

    // Clean the response from the AI model
    const cleanedText = mockApiResponse.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
    
    const questions = JSON.parse(cleanedText);

    if (!Array.isArray(questions)) {
      throw new Error("AI did not return a valid array of questions.");
    }

    return { questions };
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return {
      error: "Failed to generate questions. The AI may have returned an invalid format. Please try again.",
    };
  }
}