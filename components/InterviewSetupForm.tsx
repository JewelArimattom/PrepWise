"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

  const inputClasses =
    "w-full px-4 py-3.5 bg-[#1A1230]/60 border border-[#9400D3]/15 rounded-xl text-gray-100 placeholder-[#D8BFD8]/30 focus:ring-2 focus:ring-[#9400D3]/40 focus:border-[#9400D3]/30 transition-all duration-300 outline-none backdrop-blur-sm";

  const labelClasses = "block text-sm font-medium text-[#D8BFD8] mb-1.5";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-3xl mx-auto p-6 sm:p-10"
    >
      <div className="relative rounded-3xl shadow-2xl border border-[#9400D3]/10 overflow-hidden">
        {/* glass background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1230]/40 via-[#0C0714]/30 to-transparent backdrop-blur-2xl" />
        {/* glow accents */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#9400D3]/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#ED80E9]/10 rounded-full blur-[100px]" />

        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D3D3FF] via-[#ED80E9] to-[#9400D3] mb-3">
              AI Interview Setup
            </h1>
            <p className="text-[#D8BFD8]/60 text-lg">
              Create your personalized interview experience
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Role + Level */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label htmlFor="role" className={labelClasses}>Job Role</label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="level" className={labelClasses}>Experience Level</label>
                <select
                  name="level"
                  id="level"
                  value={formData.level}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                >
                  <option>Junior</option>
                  <option>Mid-level</option>
                  <option>Senior</option>
                </select>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2"
            >
              <label htmlFor="techStack" className={labelClasses}>Tech Stack (comma-separated)</label>
              <textarea
                name="techStack"
                id="techStack"
                value={formData.techStack}
                onChange={handleChange}
                className={`${inputClasses} min-h-[100px] resize-none`}
                required
              />
            </motion.div>

            {/* Type + Amount */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <label htmlFor="type" className={labelClasses}>Question Focus</label>
                <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={inputClasses}
                  required
                >
                  <option>Behavioural</option>
                  <option>Technical</option>
                  <option>Balanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="amount" className={labelClasses}>Number of Questions</label>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className={inputClasses}
                  min="1"
                  max="20"
                  required
                />
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#9400D3] via-[#D8BFD8] to-[#ED80E9] rounded-xl text-white font-semibold
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_32px_rgba(148,0,211,0.3)] hover:shadow-[0_12px_48px_rgba(148,0,211,0.45)] transition-shadow duration-300 relative overflow-hidden"
              >
                {!isLoading && (
                  <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                )}
                <span className="relative">
                  {isLoading ? "Generating..." : "✨ Generate Interview"}
                </span>
              </motion.button>
            </motion.div>
          </form>

          {/* Results */}
          <div className="mt-10 space-y-6">
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-[#D8BFD8]/60"
                >
                  <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="size-2.5 rounded-full bg-[#ED80E9]"
                        animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-sm">Crafting your perfect interview questions...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence>
              {newInterviewId && generatedQuestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6 bg-[#1A1230]/40 backdrop-blur-md p-6 rounded-xl border border-[#9400D3]/15"
                >
                  <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#D3D3FF] to-[#ED80E9]">
                    Interview Created! 🎉
                  </h2>
                  <div className="space-y-3">
                    {generatedQuestions.map((q, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="flex items-start space-x-4 p-4 bg-[#0C0714]/40 rounded-lg border border-[#9400D3]/10 hover:border-[#ED80E9]/20 transition-colors duration-300"
                      >
                        <span className="text-[#ED80E9] font-medium shrink-0">{index + 1}.</span>
                        <p className="text-gray-200">{q}</p>
                      </motion.div>
                    ))}
                  </div>
                  <Button
                    asChild
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-medium
                             hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-[0_8px_32px_rgba(16,185,129,0.25)]"
                  >
                    <Link href={`/interview/${newInterviewId}`}>
                      Start Your Interview →
                    </Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewSetupForm;