"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

/* ── waveform bars for mic visual ── */
const MicWaveform = ({ active, speaking }: { active: boolean; speaking: boolean }) => (
  <div className="flex items-end justify-center gap-[3px] h-8">
    {Array.from({ length: 7 }).map((_, i) => (
      <motion.span
        key={i}
        className={cn(
          "w-[3px] rounded-full",
          speaking
            ? "bg-gradient-to-t from-blue-500 to-cyan-300"
            : "bg-gradient-to-t from-blue-500/40 to-violet-300/40"
        )}
        animate={
          active && speaking
            ? { height: ["4px", `${8 + Math.random() * 18}px`, "4px"] }
            : { height: "6px" }
        }
        transition={{
          duration: 0.5 + Math.random() * 0.3,
          repeat: Infinity,
          delay: i * 0.07,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

/* ── AI typing dots indicator ── */
const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-3 py-2">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="size-2 rounded-full bg-blue-400"
        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.15,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const messagesRef = useRef<SavedMessage[]>([]);
  const hasSubmittedRef = useRef(false);
  const interviewDurationSeconds = 15 * 60;
  const progressPercent = Math.min(
    (elapsedSeconds / interviewDurationSeconds) * 100,
    100
  );
  const formatTime = (seconds: number) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  /* ── typing effect for last message ── */
  useEffect(() => {
    if (!lastMessage) return;
    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText(lastMessage.slice(0, i + 1));
      i++;
      if (i >= lastMessage.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [lastMessage]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
      if (/meeting has ended|ejection/i.test(error.message)) {
        setCallStatus(CallStatus.FINISHED);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  useEffect(() => {
    const handleGenerateFeedback = async () => {
      if (!interviewId || !userId || hasSubmittedRef.current) return;

      hasSubmittedRef.current = true;
      setIsSubmittingFeedback(true);

      const transcript =
        messagesRef.current.length > 0
          ? messagesRef.current
          : [{ role: "system", content: "Interview ended without transcript." }];

      const { success, feedbackId: id, error } = await createFeedback({
        interviewId,
        userId,
        transcript,
        feedbackId,
      });

      setIsSubmittingFeedback(false);

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
        return;
      }

      hasSubmittedRef.current = false;
      toast.error(error || "Failed to generate feedback report.");
    };

    if (callStatus !== CallStatus.FINISHED) return;

    if (type === "generate") {
      router.push("/");
      return;
    }

    const timeoutId = setTimeout(() => {
      void handleGenerateFeedback();
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [callStatus, feedbackId, interviewId, router, type, userId]);

  useEffect(() => {
    if (callStatus !== CallStatus.ACTIVE) return;

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [callStatus]);

  const handleCall = async () => {
    setElapsedSeconds(0);
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    vapi.stop();
    setCallStatus(CallStatus.FINISHED);
  };

  const isActive = callStatus === "ACTIVE";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent"
        >
          {type === "generate" ? "Practice Interview" : "Technical Assessment"}
        </motion.h2>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <p className="text-gray-400 text-sm">Live AI-powered interview session</p>
          <span className={cn(
            "text-xs px-3 py-1 rounded-full border transition-all duration-500",
            isActive
              ? "bg-emerald-500/15 border-emerald-400/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
              : "bg-blue-500/10 border-blue-400/25 text-blue-200"
          )}>
            {isActive && <span className="inline-block size-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />}
            {callStatus}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-mono tracking-wider">
            {formatTime(elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
          <span>Interview progress</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 shadow-[0_0_16px_rgba(96,165,250,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Participants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AI Interviewer */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="agent-card group"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Image
                src="/ai-avatar.png"
                alt="AI Interviewer"
                width={90}
                height={90}
                className="rounded-full border-2 border-blue-500/30 shadow-[0_0_30px_rgba(96,165,250,0.2)]"
              />
              {isSpeaking && (
                <motion.span
                  className="absolute -bottom-1 -right-1 size-5 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              {isActive && (
                <span className="absolute top-0 right-0 size-3 bg-emerald-400 rounded-full border-2 border-gray-900 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-100">AI Interviewer</h3>
            <p className="text-sm text-gray-400">Technical Expert</p>
            <MicWaveform active={isActive} speaking={isSpeaking} />
          </div>
        </motion.div>

        {/* User */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="agent-card group"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Image
                src="/user-avatar.png"
                alt={userName}
                width={90}
                height={90}
                className="rounded-full border-2 border-purple-500/30 shadow-[0_0_30px_rgba(167,139,250,0.2)]"
              />
              {isActive && (
                <span className="absolute top-0 right-0 size-3 bg-emerald-400 rounded-full border-2 border-gray-900 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-100">{userName}</h3>
            <p className="text-sm text-gray-400">Candidate</p>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                Mic connected
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Transcript */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="agent-card !p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <span className="size-2 rounded-full bg-blue-400 animate-pulse" />
                Live Transcript
              </h4>
              <span className="text-xs text-gray-500 bg-gray-700/50 px-2.5 py-1 rounded-full">
                {messages.length} messages
              </span>
            </div>
            <p className="text-gray-100 text-lg leading-relaxed">
              {displayedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-blue-400 ml-0.5 align-text-bottom"
              />
            </p>
            {isSpeaking && (
              <div className="flex items-center gap-2 mt-3">
                <TypingIndicator />
                <span className="text-xs text-blue-300">AI is speaking...</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {callStatus !== "ACTIVE" ? (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleCall()}
            disabled={callStatus === "CONNECTING" || isSubmittingFeedback}
            className={cn(
              "px-12 py-4 rounded-2xl font-semibold text-white transition-all duration-300 relative overflow-hidden",
              callStatus === "CONNECTING"
                ? "bg-gray-700/50 text-gray-400 cursor-wait"
                : "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-[0_8px_32px_rgba(96,165,250,0.3)] hover:shadow-[0_12px_48px_rgba(96,165,250,0.45)]"
            )}
          >
            {/* button glow */}
            {callStatus !== "CONNECTING" && !isSubmittingFeedback && (
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse" />
            )}
            <span className="relative z-10">
              {isSubmittingFeedback
                ? "Generating Report..."
                : callStatus === "CONNECTING"
                ? "Connecting..."
                : "🎤 Start Interview"}
            </span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleDisconnect()}
            className="px-12 py-4 rounded-2xl font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 shadow-[0_4px_20px_rgba(239,68,68,0.1)]"
          >
            End Interview
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Agent;
