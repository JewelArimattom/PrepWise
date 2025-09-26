import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin"; // Using the Admin SDK database instance

const InterviewPage = async ({ params }: { params: { id: string } }) => {
  // FIX: Use 'id' to match the likely folder name '[id]'
  const { id: interviewId } = params; 

  // Add a check to ensure the ID is not empty
  if (!interviewId) {
    return <p className="text-center mt-20">Interview ID is missing.</p>;
  }

  // Use the correct Admin SDK syntax to fetch the document
  const docRef = db.collection("interviews").doc(interviewId);
  const docSnap = await docRef.get();
  
  if (!docSnap.exists) {
    return <p className="text-center mt-20">Interview not found.</p>;
  }
  const interviewData = { id: docSnap.id, ...docSnap.data() };

  const user = await getCurrentUser();
  if (!user) {
    return <p className="text-center mt-20">Please log in to start.</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">
        Interview for: {interviewData.role}
      </h2>
      <Agent
        userName={user.name!}
        userId={user.id}
        interviewId={interviewData.id}
        questions={interviewData.questions}
        type="custom"
      />
    </main>
  );
};

export default InterviewPage;