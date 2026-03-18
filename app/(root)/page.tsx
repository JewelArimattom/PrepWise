import Link from "next/link";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import HeroScene from "@/components/HeroScene";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByUserId,
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();
  const userId = user?.id;

  const [userInterviews, allInterview, feedbackByInterviewId] = await Promise.all([
    userId ? getInterviewsByUserId(userId) : Promise.resolve([]),
    getLatestInterviews({ userId }),
    userId ? getFeedbackByUserId(userId) : Promise.resolve({}),
  ]) as [Interview[], Interview[], Record<string, Feedback | undefined>];

  const hasPastInterviews = userInterviews.length > 0;
  const hasUpcomingInterviews = allInterview.length > 0;

  return (
    <>
      <section className="card-cta premium-hero">
        <div className="hero-grid-glow" />
        <div className="flex flex-col gap-6 max-w-lg relative z-10">
          <p className="hero-chip">
            <span className="inline-block size-2 rounded-full bg-blue-400 mr-2 animate-pulse" />
            AI Interview Studio
          </p>
          <h1 className="hero-title">
            Get Interview-Ready with
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> AI-Powered </span>
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

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews.map((interview, i) => (
              <InterviewCard
                key={interview.id}
                userId={userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedback={feedbackByInterviewId[interview.id]}
                index={i}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview.map((interview, i) => (
              <InterviewCard
                key={interview.id}
                userId={userId}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedback={feedbackByInterviewId[interview.id]}
                index={i}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
