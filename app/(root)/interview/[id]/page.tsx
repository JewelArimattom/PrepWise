import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";

const InterviewPage = async ({ params }: { params: { id: string } }) => {
  const { id: interviewId } = params;

  if (!interviewId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700 shadow-xl">
          <p className="text-xl text-gray-300">Interview ID is missing.</p>
        </div>
      </div>
    );
  }

  const docRef = db.collection("interviews").doc(interviewId);
  const docSnap = await docRef.get();
  
  if (!docSnap.exists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700 shadow-xl">
          <p className="text-xl text-gray-300">Interview not found.</p>
        </div>
      </div>
    );
  }
  
  const interviewData = { id: docSnap.id, ...docSnap.data() };

  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700 shadow-xl">
          <p className="text-xl text-gray-300">Please log in to start.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Technical Interview
          </h1>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <span className="text-gray-400">Role:</span>{" "}
              <span className="text-gray-200 font-medium">{interviewData.role}</span>
            </div>
            <div className="px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <span className="text-gray-400">Level:</span>{" "}
              <span className="text-gray-200 font-medium">{interviewData.level}</span>
            </div>
            <div className="px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
              <span className="text-gray-400">Type:</span>{" "}
              <span className="text-gray-200 font-medium">{interviewData.type}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
          <div className="p-6">
            <Agent
              userName={user.name!}
              userId={user.id}
              interviewId={interviewData.id}
              questions={interviewData.questions}
              type="custom"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default InterviewPage;