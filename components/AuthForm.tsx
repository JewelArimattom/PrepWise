"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {Form} from "@/components/ui/form"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"


type FormType = "sign-in" | "sign-up"



const AuthFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-in" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(4),
    })
}

const AuthForm = ({ type }: { type: FormType }) => {

    const router = useRouter()

    const formSchema = AuthFormSchema(type)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === "sign-up") {
                toast.success("Account created successfully");
                router.push("/sign-in")
                console.log(values);
            } else {
                toast.success("Signed in successfully");
                router.push("/") 
                console.log(values);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    const isSignIn = type === "sign-in"

    return (
        <div className="card-border lg:min-w[566px] ">

            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" width={38} height={32} />
                    <h2 className="text-primary-100 text-2xl font-semibold">PrepWise</h2>

                </div>
                <h3>Practice your interview skills with AI</h3>
            
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                    {!isSignIn && (
                        <FormField control={form.control} name="name" label="Name" placeholder="Your name" />
                    )}
                    <FormField control={form.control} name="email" label="Email" placeholder="Your email" />
                    <FormField control={form.control} name="password" label="Password" placeholder="Your password" type="password" />
                    <Button className="btn" type="submit">{isSignIn ? "Sign In" : "Create an account"}</Button>
                </form>
            </Form>
            <p className="text-center">
                {isSignIn ? "Don't have an account?" : "Already have an account?"}
                <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-user-primary ml-1">
                {isSignIn ? "Create an account" : "Sign In"}</Link>
            </p>
            </div>
        </div>
    )
}

export default AuthForm
