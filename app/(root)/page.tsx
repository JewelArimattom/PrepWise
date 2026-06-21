import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import InterviewCarousel from "@/components/InterviewCarousel";
import HeroScene from "@/components/HeroScene";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLatestInterviews, getFeedbackByUserId } from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();
  const userId = user?.id;

  const [allInterview, feedbackByInterviewId] = await Promise.all([
    getLatestInterviews({ userId }),
    userId ? getFeedbackByUserId(userId) : Promise.resolve({}),
  ]) as [Interview[], Record<string, Feedback | undefined>];

  const hasUpcomingInterviews = allInterview.length > 0;

  return (
    <>
      {/* ── HERO ── */}
      <section className="card-cta premium-hero">
        <div className="hero-grid-glow" />
        <div className="flex flex-col gap-6 max-w-lg relative z-10">
          <p className="hero-chip">
            <span className="inline-block size-2 rounded-full bg-[#ED80E9] mr-2 animate-pulse" />
            AI Interview Studio
          </p>
          <h1 className="hero-title">
            Get Interview-Ready with
            <span className="bg-gradient-to-r from-[#9400D3] to-[#ED80E9] bg-clip-text text-transparent"> AI-Powered </span>
            Practice & Feedback
          </h1>
          <p className="text-lg text-light-100/90">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary premium-btn max-sm:w-full">
            <Link href={userId ? "/interview" : "/sign-in"} prefetch>
              Start an Interview
            </Link>
          </Button>
        </div>

        <div className="max-sm:hidden w-full max-w-xl">
          <HeroScene />
        </div>
      </section>

      {/* ── FEATURES / HOW IT WORKS ── */}
      <section className="flex flex-col gap-8 mt-16">
        <div className="section-heading">
          <h2>How PrepWise Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4">
            <div className="size-12 rounded-xl bg-[#9400D3]/10 border border-[#9400D3]/20 flex items-center justify-center text-2xl">
              🎤
            </div>
            <h3 className="text-xl font-semibold text-white">Live Voice AI</h3>
            <p className="text-[#D8BFD8]/70 text-sm leading-relaxed">
              Practice answering questions in real-time. Our advanced AI voice engine listens to your responses and simulates a real interview environment.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4">
            <div className="size-12 rounded-xl bg-[#ED80E9]/10 border border-[#ED80E9]/20 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-semibold text-white">Instant Feedback</h3>
            <p className="text-[#D8BFD8]/70 text-sm leading-relaxed">
              Get immediate, actionable feedback on your answers. We analyze your technical accuracy, clarity, and communication skills to help you improve.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4">
            <div className="size-12 rounded-xl bg-[#D3D3FF]/10 border border-[#D3D3FF]/20 flex items-center justify-center text-2xl">
              🎯
            </div>
            <h3 className="text-xl font-semibold text-white">Targeted Practice</h3>
            <p className="text-[#D8BFD8]/70 text-sm leading-relaxed">
              Choose interviews tailored to your specific role, experience level, and tech stack. We generate questions that match what real employers ask.
            </p>
          </div>
        </div>
      </section>

      {/* ── TAKE INTERVIEWS (Horizontal Scroll) ── */}
      <section className="flex flex-col gap-8 mt-16 relative">
        <div className="section-heading flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#D8BFD8]">Take Interviews</h2>
            <p className="text-[#D8BFD8]/60 text-sm mt-1">Swipe to browse available mock interviews</p>
          </div>
          <div className="hidden md:flex gap-2 items-center">
            <span className="text-xs text-[#D8BFD8]/40 uppercase tracking-widest font-semibold">Scroll</span>
            <span className="text-[#D8BFD8]/40 animate-pulse">→</span>
          </div>
        </div>

        <InterviewCarousel>
          {hasUpcomingInterviews ? (
            allInterview.map((interview, i) => (
              <div key={interview.id} className="snap-center shrink-0 first:ml-0">
                <InterviewCard
                  userId={userId}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                  feedback={feedbackByInterviewId[interview.id]}
                  index={i}
                />
              </div>
            ))
          ) : (
            <div className="w-full glass-panel rounded-2xl py-16 text-center mx-[5%]">
              <p className="text-[#D8BFD8]/50 text-lg">There are no interviews available</p>
              <p className="text-[#D8BFD8]/30 text-sm mt-1">Check back soon for new opportunities</p>
            </div>
          )}
        </InterviewCarousel>
      </section>
    </>
  );
}

export default Home;
