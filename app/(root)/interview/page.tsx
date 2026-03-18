import { redirect } from "next/navigation";

import InterviewSetupForm from "@/components/InterviewSetupForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewGenerationPage = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <InterviewSetupForm />
    </main>
  );
};

export default InterviewGenerationPage;
