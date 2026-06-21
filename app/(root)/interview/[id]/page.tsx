import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";
import { redirect } from "next/navigation";

const InterviewPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id: interviewId } = await params;
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  if (!interviewId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 glass-panel rounded-2xl">
          <p className="text-xl text-[#D8BFD8]">Interview ID is missing.</p>
        </div>
      </div>
    );
  }

  const docRef = db.collection("interviews").doc(interviewId);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 glass-panel rounded-2xl">
          <p className="text-xl text-[#D8BFD8]">Interview not found.</p>
        </div>
      </div>
    );
  }

  const interviewData = { id: docSnap.id, ...docSnap.data() };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D3D3FF] via-[#ED80E9] to-[#9400D3]">
            Technical Interview
          </h1>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="px-4 py-2 glass-panel rounded-xl text-sm">
              <span className="text-[#D8BFD8]/60">Role:</span>{" "}
              <span className="text-gray-100 font-medium">{interviewData.role}</span>
            </div>
            <div className="px-4 py-2 glass-panel rounded-xl text-sm">
              <span className="text-[#D8BFD8]/60">Level:</span>{" "}
              <span className="text-gray-100 font-medium">{interviewData.level}</span>
            </div>
            <div className="px-4 py-2 glass-panel rounded-xl text-sm">
              <span className="text-[#D8BFD8]/60">Type:</span>{" "}
              <span className="text-gray-100 font-medium">{interviewData.type}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl shadow-[0_16px_64px_rgba(12,7,20,0.5)] overflow-hidden">
          <div className="p-6 sm:p-8">
            <Agent
              userName={user.name!}
              userId={user.id}
              interviewId={interviewData.id}
              questions={interviewData.questions}
              type="interview"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default InterviewPage;
