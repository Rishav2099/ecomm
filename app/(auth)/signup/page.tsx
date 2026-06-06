"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const formSchema = z.object({
  name: z.string(),
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, "Minimum 8 characters"),
});

const page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isPending = form.formState.isSubmitting;
  const [isGithubPending, setIsGithubPending] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { error } = await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => router.push("/"),
      },
    );

    if (error) {
      toast.error(error.message || "Invalid credentials");
      return;
    }

    toast.success("Signed up successfully");
  };

  const handleGithubSignIn = async () => {
    setIsGithubPending(true);
    const { error } = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message || "Failed to sign in with GitHub");
      setIsGithubPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Create new account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to your account
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>

                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter your name"
                    aria-invalid={fieldState.invalid}
                    className="mt-2"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <Input
                    {...field}
                    id="email"
                    placeholder="Enter your email"
                    aria-invalid={fieldState.invalid}
                    className="mt-2"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <div className="relative mt-2">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      aria-invalid={fieldState.invalid}
                      className="pr-16"
                    />

                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || isGithubPending}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* GitHub Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGithubSignIn}
            disabled={isPending || isGithubPending}
          >
            <Github className="mr-2 h-4 w-4" />
            {isGithubPending ? "Connecting..." : "GitHub"}
          </Button>

          <div className="text-center">
            <Link href={"/login"} className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <span className="cursor-pointer text-primary hover:underline">
                Log In
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
