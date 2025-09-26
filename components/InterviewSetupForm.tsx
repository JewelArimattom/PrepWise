"use client";

import { useState } from "react";
import { generateInterviewQuestions } from "@/lib/actions/interview.action";

const InterviewSetupForm = () => {
  const [formData, setFormData] = useState({
    role: "Software Engineer",
    level: "Mid-level",
    techStack: "React, Node.js, TypeScript",
    type: "Balanced",
    amount: 5,
  });
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedQuestions([]);

    try {
      const result = await generateInterviewQuestions(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.questions) {
        setGeneratedQuestions(result.questions);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-gray-900 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-2">
        AI Interview Setup
      </h1>
      <p className="text-gray-400 mb-8">
        Tailor the interview questions to your specific needs.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Role & Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
              Job Role
            </label>
            <input
              type="text"
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Frontend Developer"
              required
            />
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-300 mb-2">
              Experience Level
            </label>
            <select
              name="level"
              id="level"
              value={formData.level}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option>Junior</option>
              <option>Mid-level</option>
              <option>Senior</option>
              <option>Lead</option>
            </select>
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label htmlFor="techStack" className="block text-sm font-medium text-gray-300 mb-2">
            Tech Stack (comma-separated)
          </label>
          <textarea
            name="techStack"
            id="techStack"
            value={formData.techStack}
            onChange={handleChange}
            className="form-input min-h-[80px]"
            placeholder="e.g., Next.js, GraphQL, PostgreSQL"
            required
          />
        </div>

        {/* Row 3: Type & Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
              Question Focus
            </label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option>Behavioural</option>
              <option>Technical</option>
              <option>Balanced</option>
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              className="form-input"
              min="1"
              max="20"
              required
            />
          </div>
        </div>
        
        <div className="pt-2">
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Generating..." : "✨ Generate Questions"}
          </button>
        </div>
      </form>
      
      {/* Results Section */}
      <div className="mt-10">
        {isLoading && <div className="text-center text-gray-400">Please wait while we craft your questions...</div>}
        {error && <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">{error}</div>}
        {generatedQuestions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Generated Questions:</h2>
            <ol className="list-decimal list-inside bg-gray-800/50 p-6 rounded-lg space-y-3 text-gray-200">
              {generatedQuestions.map((q, index) => (
                <li key={index}>{q}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSetupForm;