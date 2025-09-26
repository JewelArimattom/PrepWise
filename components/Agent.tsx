"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
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
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
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
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
  <div className="space-y-10">
    {/* Header */}
    <div className="text-center">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {type === "generate" ? "Practice Interview" : "Technical Assessment"}
      </h2>
      <p className="text-gray-400 mt-2 text-sm">Live AI-powered interview session</p>
    </div>

    {/* Participants */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* AI Interviewer */}
      <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Image
              src="/ai-avatar.png"
              alt="AI Interviewer"
              width={90}
              height={90}
              className="rounded-full border-4 border-blue-500/40 shadow-md"
            />
            {isSpeaking && (
              <span className="absolute bottom-0 right-0 h-5 w-5 bg-blue-500 rounded-full animate-pulse" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-200">AI Interviewer</h3>
          <p className="text-sm text-gray-400">Technical Expert</p>
        </div>
      </div>

      {/* User */}
      <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700/50 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Image
              src="/user-avatar.png"
              alt={userName}
              width={90}
              height={90}
              className="rounded-full border-4 border-purple-500/40 shadow-md"
            />
            {callStatus === "ACTIVE" && (
              <span className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 rounded-full" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-200">{userName}</h3>
          <p className="text-sm text-gray-400">Candidate</p>
        </div>
      </div>
    </div>

    {/* Transcript */}
    {messages.length > 0 && (
      <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-6 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-400">Live Transcript</h4>
          <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded-md">
            {messages.length} messages
          </span>
        </div>
        <p className="text-gray-200 text-lg leading-relaxed animate-fadeIn">
          {lastMessage}
        </p>
      </div>
    )}

    {/* Controls */}
    <div className="flex justify-center">
      {callStatus !== "ACTIVE" ? (
        <button
          onClick={() => handleCall()}
          disabled={callStatus === "CONNECTING"}
          className={cn(
            "px-10 py-4 rounded-xl font-medium text-white transition-all duration-300",
            callStatus === "CONNECTING"
              ? "bg-gray-700/50 text-gray-400 cursor-wait"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 shadow-lg hover:shadow-blue-500/20"
          )}
        >
          {callStatus === "CONNECTING" ? "Connecting..." : "Start Interview"}
        </button>
      ) : (
        <button
          onClick={() => handleDisconnect()}
          className="px-10 py-4 rounded-xl font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 shadow-md"
        >
          End Interview
        </button>
      )}
    </div>
  </div>
);

};

export default Agent;
