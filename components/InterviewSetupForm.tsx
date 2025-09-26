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
    <div className="w-full max-w-3xl mx-auto p-6 sm:p-10">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700">
        <div className="p-6 sm:p-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
              AI Interview Setup
            </h1>
            <p className="text-gray-400 text-lg">
              Create your personalized interview experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role and Level Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                  Job Role
                </label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-400
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="level" className="block text-sm font-medium text-gray-300">
                  Experience Level
                </label>
                <select
                  name="level"
                  id="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option>Junior</option>
                  <option>Mid-level</option>
                  <option>Senior</option>
                </select>
              </div>
            </div>

            {/* Tech Stack Section */}
            <div className="space-y-2">
              <label htmlFor="techStack" className="block text-sm font-medium text-gray-300">
                Tech Stack (comma-separated)
              </label>
              <textarea
                name="techStack"
                id="techStack"
                value={formData.techStack}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-400
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[100px]"
                required
              />
            </div>

            {/* Question Type and Amount Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-300">
                  Question Focus
                </label>
                <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option>Behavioural</option>
                  <option>Technical</option>
                  <option>Balanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
                  Number of Questions
                </label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-200
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  min="1"
                  max="20"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium
                       transform transition-all duration-200 hover:from-blue-600 hover:to-purple-600 
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Generating..." : "✨ Generate Interview"}
            </button>
          </form>

          {/* Results Section */}
          <div className="mt-10 space-y-6">
            {isLoading && (
              <div className="text-center text-gray-400 animate-pulse">
                Crafting your perfect interview questions...
              </div>
            )}
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
                {error}
              </div>
            )}

            {newInterviewId && generatedQuestions.length > 0 && (
              <div className="space-y-6 bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Interview Created! 🎉
                </h2>
                <div className="space-y-4">
                  {generatedQuestions.map((q, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <span className="text-blue-400 font-medium">{index + 1}.</span>
                      <p className="text-gray-300">{q}</p>
                    </div>
                  ))}
                </div>
                <Button
                  asChild
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-medium
                           hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                >
                  <Link href={`/interview/${newInterviewId}`}>
                    Start Your Interview →
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetupForm;