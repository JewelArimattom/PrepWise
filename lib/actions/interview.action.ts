"use server";

import { db } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { getCurrentUser } from "./auth.action"; // Your user authentication action

// First, let's add more structured types for our questions
interface QuestionContext {
  role: string;
  level: string;
  techStack: string[];
  type: string;
}

interface QuestionTemplate {
  template: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  requiresTechStack?: boolean;
}

const questionBank = {
  technical: [
    {
      template: "How would you implement {feature} using {tech}?",
      difficulty: "intermediate",
      category: "implementation",
      requiresTechStack: true
    },
    {
      template: "Explain the architecture decisions you would make when building {system} that needs to handle {scale}",
      difficulty: "advanced",
      category: "system_design"
    },
    {
      template: "What are the key performance considerations when working with {tech} in {scenario}?",
      difficulty: "advanced",
      category: "performance",
      requiresTechStack: true
    },
    {
      template: "How would you handle error handling and logging for {feature} in {tech}?",
      difficulty: "intermediate",
      category: "implementation",
      requiresTechStack: true
    },
    {
      template: "Describe your approach to testing {feature} using {tech}",
      difficulty: "intermediate",
      category: "testing",
      requiresTechStack: true
    }
  ] as QuestionTemplate[],
  
  behavioral: [
    {
      template: "Describe a challenging situation where you had to learn {tech} quickly. How did you approach it?",
      difficulty: "intermediate",
      category: "learning",
      requiresTechStack: true
    },
    {
      template: "Tell me about a time when you improved {process} in your team. What was the impact?",
      difficulty: "intermediate",
      category: "leadership"
    },
    {
      template: "How do you handle conflicts in {scenario} situations?",
      difficulty: "intermediate",
      category: "teamwork"
    },
    {
      template: "Describe a situation where you had to make a difficult technical decision about {tech}",
      difficulty: "advanced",
      category: "decision_making",
      requiresTechStack: true
    },
    {
      template: "How do you approach mentoring junior developers in {tech}?",
      difficulty: "advanced",
      category: "leadership",
      requiresTechStack: true
    }
  ] as QuestionTemplate[],
  
  balanced: [
    // Mix of technical and behavioral questions
    {
      template: "How do you ensure code quality when working with {tech}?",
      difficulty: "intermediate",
      category: "best_practices",
      requiresTechStack: true
    },
    {
      template: "Describe your approach to documenting {feature} for other developers",
      difficulty: "intermediate",
      category: "communication"
    },
    {
      template: "How do you balance technical debt vs new features in {scenario}?",
      difficulty: "advanced",
      category: "decision_making"
    }
  ] as QuestionTemplate[]
};

const contextData = {
  features: [
    "authentication system",
    "real-time data synchronization",
    "caching layer",
    "search functionality",
    "payment processing",
    "file upload system"
  ],
  systems: [
    "e-commerce platform",
    "social media application",
    "content management system",
    "real-time messaging service",
    "data analytics dashboard"
  ],
  scales: [
    "millions of daily active users",
    "terabytes of data processing",
    "global distributed traffic",
    "high-concurrency operations",
    "real-time event processing"
  ],
  processes: [
    "code review workflow",
    "deployment pipeline",
    "testing strategy",
    "documentation process",
    "team collaboration"
  ],
  scenarios: [
    "high-load production environment",
    "distributed microservices architecture",
    "legacy system migration",
    "startup rapid development",
    "enterprise-scale application"
  ]
};

async function callAIToGenerateQuestions(prompt: string): Promise<string[]> {
  const context: QuestionContext = {
    role: prompt.includes('engineer') ? 'engineer' : 'developer',
    level: prompt.includes('senior') ? 'advanced' : prompt.includes('junior') ? 'beginner' : 'intermediate',
    techStack: prompt.match(/experience in (.*?)\./)?.[1].split(',').map(t => t.trim()) || [],
    type: prompt.toLowerCase().includes('technical') ? 'technical' : 
          prompt.toLowerCase().includes('behavioral') ? 'behavioral' : 'balanced'
  };

  const generateQuestion = (template: QuestionTemplate): string => {
    let question = template.template;
    
    // Replace placeholders with context-appropriate content
    question = question
      .replace('{feature}', contextData.features[Math.floor(Math.random() * contextData.features.length)])
      .replace('{system}', contextData.systems[Math.floor(Math.random() * contextData.systems.length)])
      .replace('{scale}', contextData.scales[Math.floor(Math.random() * contextData.scales.length)])
      .replace('{process}', contextData.processes[Math.floor(Math.random() * contextData.processes.length)])
      .replace('{scenario}', contextData.scenarios[Math.floor(Math.random() * contextData.scenarios.length)]);

    // If template requires tech stack, insert relevant technology
    if (template.requiresTechStack && context.techStack.length > 0) {
      question = question.replace('{tech}', context.techStack[Math.floor(Math.random() * context.techStack.length)]);
    }

    return question;
  };

  const getQuestionCount = (prompt: string): number => {
    const match = prompt.match(/Prepare (\d+)/);
    return match ? parseInt(match[1]) : 5;
  };

  // Get all relevant templates based on type and difficulty
  let templates = [...questionBank[context.type as keyof typeof questionBank]];
  
  // If balanced type, include questions from both technical and behavioral
  if (context.type === 'balanced') {
    templates = [
      ...templates,
      ...questionBank.technical.slice(0, 2),
      ...questionBank.behavioral.slice(0, 2)
    ];
  }

  // Filter by difficulty
  templates = templates.filter(template => {
    if (context.level === 'beginner') return template.difficulty === 'beginner';
    if (context.level === 'intermediate') return template.difficulty !== 'advanced';
    return true; // For advanced level, include all questions
  });

  // Generate the requested number of unique questions
  const questionCount = getQuestionCount(prompt);
  const questions = new Set<string>();
  
  // Keep trying to generate questions until we have enough or run out of templates
  while (questions.size < Math.min(questionCount, templates.length)) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const question = generateQuestion(template);
    questions.add(question);
  }

  return Array.from(questions);
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