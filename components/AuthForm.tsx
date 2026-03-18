"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({ email, idToken });
        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="min-h-screen w-full grid md:grid-cols-2">

      {/* ── LEFT PANEL: Brand Experience ── */}
      <div
        className="hidden md:flex flex-col items-center justify-center relative overflow-hidden px-12 py-16"
        style={{
          background:
            "linear-gradient(135deg, rgba(30,15,60,0.98) 0%, rgba(2,6,23,0.98) 100%)",
        }}
      >
        {/* Ambient glow blobs */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[36rem] h-[36rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(96,165,250,0.18), transparent 60%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[30rem] h-[30rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.18), transparent 60%)",
            filter: "blur(60px)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <Image src="/logo.svg" alt="PrepWise Logo" width={44} height={38} />
            <span className="text-4xl font-bold font-[var(--font-space-grotesk)] text-white tracking-tight">
              Prep
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Wise
              </span>
            </span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Ace your next
            <br />
            <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              interview with AI
            </span>
          </h2>
          <p className="text-blue-100/60 text-base mb-12 max-w-sm mx-auto leading-relaxed">
            Practice with real questions, get instant feedback, and track your
            progress.
          </p>

          {/* Feature chips */}
          {[
            { icon: "🎤", label: "AI Voice Interviews" },
            { icon: "📊", label: "Instant Score & Feedback" },
            { icon: "⚡", label: "250+ Question Bank" },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-3 mb-4 px-5 py-3 rounded-xl text-left"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="text-xl">{f.icon}</span>
              <span className="text-sm text-white/80 font-medium">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL: Glass Form ── */}
      <div
        className="flex items-center justify-center px-6 py-12 min-h-screen relative"
        style={{ background: "rgba(2,6,23,0.98)" }}
      >
        {/* Subtle glow behind the card */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(96,165,250,0.08), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative w-full max-w-md z-10">
          {/* Mobile logo (visible only on small screens) */}
          <div className="flex md:hidden items-center justify-center gap-2 mb-8">
            <Image src="/logo.svg" alt="PrepWise Logo" width={32} height={28} />
            <span className="text-2xl font-bold text-white">
              Prep<span className="text-blue-400">Wise</span>
            </span>
          </div>

          {/* Glass Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 25px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            <div className="mb-7">
              <h2 className="text-2xl font-semibold text-white mb-1">
                {isSignIn ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-white/40">
                {isSignIn
                  ? "Sign in to continue your interview prep"
                  : "Start your AI-powered interview journey"}
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-5 form"
              >
                {!isSignIn && (
                  <FormField
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="Your full name"
                    type="text"
                  />
                )}

                <FormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                />

                <FormField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all duration-300 mt-2 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    boxShadow: "0 0 30px rgba(96,165,250,0.3)",
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 48px rgba(96,165,250,0.5), 0 0 14px rgba(167,139,250,0.3)";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1.02)";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 0 30px rgba(96,165,250,0.3)";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1)";
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isSignIn ? "Signing in…" : "Creating account…"}
                    </span>
                  ) : isSignIn ? (
                    "Sign In →"
                  ) : (
                    "Create Account →"
                  )}
                </button>
              </form>
            </Form>

            <p className="text-center text-sm text-white/40 mt-6">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                href={isSignIn ? "/sign-up" : "/sign-in"}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
