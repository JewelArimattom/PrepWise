"use server";

import { db } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { getCurrentUser } from "./auth.action"; // Your user authentication action

// Placeholder for your actual AI API call.
async function callAIToGenerateQuestions(prompt: string): Promise<string[]> {
  const questionTemplates = {
    technical: [
      `Explain how you would implement {concept} in {techStack}`,
      `Describe your experience with {technology} and how you've used it in production`,
      `How would you optimize {component} for better performance?`,
      `What are the key differences between {tech1} and {tech2}?`,
      `How would you debug a {problem} issue in {environment}?`
    ],
    behavioral: [
      `Tell me about a challenging project where you used {techStack}`,
      `How do you handle disagreements with {stakeholder}?`,
      `Describe a time you had to learn {technology} quickly for a project`,
      `Share an experience where you improved {process} in your team`,
      `How do you prioritize tasks when working on {scenario}?`
    ],
    system_design: [
      `Design a scalable {system} that handles {requirement}`,
      `How would you architect a {service} using {techStack}?`,
      `Explain your approach to designing {feature} for high availability`,
      `How would you handle {scale} of data in {context}?`,
      `Describe the tradeoffs in your design of {component}`
    ]
  };

  const technologies = {
    frontend: ['React', 'Angular', 'Vue', 'Next.js', 'TypeScript'],
    backend: ['Node.js', 'Python', 'Java', 'Go', 'PHP'],
    database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch'],
    cloud: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes']
  };

  // Parse the prompt to extract key information
  const level = prompt.includes('senior') ? 'senior' : 'junior';
  const type = prompt.toLowerCase().includes('technical') ? 'technical' : 
               prompt.toLowerCase().includes('system') ? 'system_design' : 'behavioral';
  
  const selectedTemplates = questionTemplates[type];
  const questions = selectedTemplates.map(template => {
    // Replace placeholders with relevant content
    return template
      .replace('{techStack}', technologies.frontend.concat(technologies.backend)
        .sort(() => Math.random() - 0.5)[0])
      .replace('{technology}', technologies.frontend.concat(technologies.backend)
        .sort(() => Math.random() - 0.5)[0])
      .replace('{concept}', level === 'senior' ? 
        'advanced state management' : 'basic component architecture')
      .replace('{component}', level === 'senior' ? 
        'a complex data grid' : 'a simple form')
      .replace('{stakeholder}', level === 'senior' ? 
        'team leads' : 'team members')
      .replace('{process}', level === 'senior' ? 
        'the development workflow' : 'code quality')
      .replace('{scenario}', level === 'senior' ? 
        'multiple concurrent projects' : 'your assigned tasks')
      .replace('{system}', level === 'senior' ? 
        'microservices architecture' : 'basic web application')
      .replace('{requirement}', level === 'senior' ? 
        'millions of concurrent users' : 'thousands of daily users')
      .replace('{service}', level === 'senior' ? 
        'distributed system' : 'monolithic application')
      .replace('{scale}', level === 'senior' ? 
        'petabytes' : 'gigabytes')
      .replace('{context}', 'real-time processing')
      .replace('{problem}', level === 'senior' ? 
        'complex performance' : 'common runtime')
      .replace('{environment}', level === 'senior' ? 
        'production' : 'development');
  });

  // Randomize the order of questions
  return questions.sort(() => Math.random() - 0.5);
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