import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Star } from "lucide-react";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import InterviewCardMotion from "./InterviewCardMotion";

import { cn, getRandomInterviewCover } from "@/lib/utils";

const InterviewCard = ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  feedback,
  index = 0,
}: InterviewCardProps & { index?: number }) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-[#D8BFD8]/20 text-[#D8BFD8]",
      Mixed: "bg-[#9400D3]/20 text-[#D3D3FF]",
      Technical: "bg-[#1A1230] border border-[#9400D3]/30 text-white",
    }[normalizedType] || "bg-[#9400D3]/20 text-white";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  const ctaHref = !userId
    ? "/sign-in"
    : feedback
    ? `/interview/${interviewId}/feedback`
    : `/interview/${interviewId}`;

  const ctaLabel = !userId
    ? "Sign in to Start"
    : feedback
    ? "Check Feedback"
    : "View Interview";

  return (
    <InterviewCardMotion index={index}>
      <div className="group flex flex-col h-full bg-[#1A1230]/40 backdrop-blur-md border border-[#9400D3]/15 rounded-2xl overflow-hidden hover:border-[#ED80E9]/40 hover:bg-[#1A1230]/70 transition-all duration-300 shadow-[0_8px_32px_rgba(12,7,20,0.5),inset_0_1px_0_rgba(211,211,255,0.05)] hover:shadow-[0_12px_48px_rgba(148,0,211,0.15),inset_0_1px_0_rgba(211,211,255,0.1)]">
        {/* Top Section */}
        <div className="p-6 pb-4 flex-grow flex flex-col">
          <div className="flex justify-between items-start w-full mb-5">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={56}
              height={56}
              className="rounded-xl object-cover size-14 shadow-sm"
            />
            <div
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium tracking-wide",
                badgeColor
              )}
            >
              {normalizedType}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-white capitalize mb-1 group-hover:text-[#D3D3FF] transition-colors duration-300">
            {role}
          </h3>
          <p className="text-sm text-[#D8BFD8]/70 mb-4">
            Practice Interview
          </p>

          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center gap-2 text-sm text-[#D8BFD8]/80">
              <CalendarDays className="size-4 opacity-70" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#D8BFD8]/80">
              <Star className="size-4 opacity-70" />
              <span>{feedback?.totalScore ? `${feedback.totalScore}/100 Score` : "Not taken yet"}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#9400D3]/20 to-transparent group-hover:via-[#ED80E9]/30 transition-colors duration-500" />

        {/* Bottom Section */}
        <div className="p-6 pt-5 bg-[#0C0714]/40 flex flex-col gap-5">
          <div className="min-h-[24px]">
            <DisplayTechIcons techStack={techstack} />
          </div>

          <Button asChild className="w-full bg-gradient-to-r from-[#9400D3] to-[#ED80E9] hover:shadow-[0_0_24px_rgba(237,128,233,0.3)] text-white shadow-md border border-white/10 hover:border-white/20 font-medium transition-all duration-300 relative overflow-hidden group/btn">
            <Link href={ctaHref} prefetch>
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <span className="relative">{ctaLabel}</span>
            </Link>
          </Button>
        </div>
      </div>
    </InterviewCardMotion>
  );
};

export default InterviewCard;
