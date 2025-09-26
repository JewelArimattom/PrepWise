"use client";

import { useState } from "react";
import Link from "next/link";
import { generateAndSaveInterview } from "@/lib/actions/interview.action";
import { Button } from "./ui/button";

const InterviewSetupForm = () => {
  const [formData, setFormData] = useState({
    role: "Software Engineer",
    level: "Mid-level",
    techStack: "React, Node.js, TypeScript",
    type: "Balanced",
    amount: 5,
  });

  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [newInterviewId, setNewInterviewId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedQuestions([]);
    setNewInterviewId(null);
    try {
      const result = await generateAndSaveInterview(formData);
      if (result.error) setError(result.error);
      else if (result.interviewId && result.questions) {
        setGeneratedQuestions(result.questions);
        setNewInterviewId(result.interviewId);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-gray-900 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-2">AI Interview Setup</h1>
      <p className="text-gray-400 mb-8">Tailor interview questions to your specific needs.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="role" className="form-label">Job Role</label>
            <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} className="form-input" required />
          </div>
          <div>
            <label htmlFor="level" className="form-label">Experience Level</label>
            <select name="level" id="level" value={formData.level} onChange={handleChange} className="form-input" required>
              <option>Junior</option><option>Mid-level</option><option>Senior</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="techStack" className="form-label">Tech Stack (comma-separated)</label>
          <textarea name="techStack" id="techStack" value={formData.techStack} onChange={handleChange} className="form-input min-h-[80px]" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="type" className="form-label">Question Focus</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange} className="form-input" required>
              <option>Behavioural</option><option>Technical</option><option>Balanced</option>
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="form-label">Number of Questions</label>
            <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} className="form-input" min="1" max="20" required />
          </div>
        </div>
        <div className="pt-2">
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Generating..." : "✨ Generate Interview"}
          </button>
        </div>
      </form>
      <div className="mt-10">
        {isLoading && <div className="text-center text-gray-400">Please wait...</div>}
        {error && <div className="text-center text-red-400 p-4 rounded-lg">{error}</div>}
        {newInterviewId && generatedQuestions.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Interview Created!</h2>
            <ol className="list-decimal list-inside bg-gray-800/50 p-6 rounded-lg space-y-3">
              {generatedQuestions.map((q, index) => <li key={index}>{q}</li>)}
            </ol>
            <Button asChild className="w-full btn-secondary text-lg">
              <Link href={`/interview/${newInterviewId}`}>Start Your Interview</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default InterviewSetupForm;