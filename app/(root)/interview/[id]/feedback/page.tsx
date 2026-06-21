import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Star, CalendarDays } from "lucide-react";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

const FeedbackPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const [user, interview] = await Promise.all([
    getCurrentUser(),
    getInterviewById(id),
  ]);

  if (!interview) redirect("/");
  if (!user) redirect("/sign-in");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  return (
    <section className="section-feedback">
      {/* ── HEADER ── */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#D3D3FF] via-[#ED80E9] to-[#9400D3] bg-clip-text text-transparent">
          Interview Feedback
        </h1>
        <p className="text-lg text-[#D8BFD8]/70">
          <span className="capitalize">{interview.role}</span> Interview Assessment
        </p>
      </div>

      {/* ── SCORE + DATE BAR ── */}
      <div className="flex flex-row justify-center">
        <div className="flex flex-row gap-6 items-center glass-panel rounded-2xl px-6 py-3">
          <div className="flex flex-row gap-2 items-center">
            <Star className="size-[22px] text-[#ED80E9]" />
            <p>
              Overall Score:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D3D3FF] to-[#ED80E9] font-bold text-lg">
                {feedback?.totalScore ?? "N/A"}
              </span>
              <span className="text-[#D8BFD8]/50">/100</span>
            </p>
          </div>

          <div className="h-6 w-px bg-[#9400D3]/15" />

          <div className="flex flex-row gap-2 items-center">
            <CalendarDays className="size-[22px] text-[#9400D3]" />
            <p className="text-[#D8BFD8]/70">
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-[#9400D3]/10" />

      {/* ── ASSESSMENT ── */}
      <div className="glass-panel rounded-2xl p-6">
        <p className="text-gray-200 leading-relaxed">{feedback?.finalAssessment}</p>
      </div>

      {/* ── BREAKDOWN ── */}
      {feedback?.categoryScores && feedback.categoryScores.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#ED80E9]" />
            Breakdown of the Interview
          </h2>
          <div className="grid gap-4">
            {feedback.categoryScores.map((category, index) => (
              <div
                key={index}
                className="glass-panel rounded-xl p-5 hover:border-[#ED80E9]/20 transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-gray-100">
                    {index + 1}. {category.name}
                  </p>
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-[#9400D3]/10 border border-[#9400D3]/20 text-[#D3D3FF]">
                    {category.score}/100
                  </span>
                </div>
                {/* Score bar */}
                <div className="h-1.5 w-full rounded-full bg-[#1A1230]/60 overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#9400D3] to-[#ED80E9] transition-all duration-700"
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                <p className="text-gray-300 text-[15px] leading-relaxed">{category.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STRENGTHS ── */}
      {feedback?.strengths && feedback.strengths.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400" />
            Strengths
          </h3>
          <div className="glass-panel rounded-xl p-5">
            <ul className="space-y-2">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="text-gray-200 flex items-start gap-2">
                  <span className="text-emerald-400 mt-1 shrink-0">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── AREAS FOR IMPROVEMENT ── */}
      {feedback?.areasForImprovement && feedback.areasForImprovement.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-amber-400" />
            Areas for Improvement
          </h3>
          <div className="glass-panel rounded-xl p-5">
            <ul className="space-y-2">
              {feedback.areasForImprovement.map((area, index) => (
                <li key={index} className="text-gray-200 flex items-start gap-2">
                  <span className="text-amber-400 mt-1 shrink-0">→</span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ── ACTION BUTTONS ── */}
      <div className="buttons">
        <Button asChild className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            Back to dashboard
          </Link>
        </Button>

        <Button asChild className="btn-primary premium-btn flex-1">
          <Link href={`/interview/${id}`} className="flex w-full justify-center">
            Retake Interview
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FeedbackPage;
