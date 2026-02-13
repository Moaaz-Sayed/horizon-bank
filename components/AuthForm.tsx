"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";

const SIGN_UP_DEFAULTS = {
  address1: "123 Main St",
  city: "New York",
  state: "NY",
  postalCode: "10001",
  dateOfBirth: "1990-01-01",
  ssn: "1234",
};

function AuthForm({ type }: { type: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isSignIn = type === "sign-in";
  const isSignUp = type === "sign-up";

  const formScema = authFormSchema(type);

  const form = useForm<z.infer<typeof formScema>>({
    resolver: zodResolver(formScema),
    defaultValues: {
      firstName: "",
      lastName: "",
      ...SIGN_UP_DEFAULTS,
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formScema>) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      //Sign up with Appwrite & create plaid token

      if (isSignUp) {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: SIGN_UP_DEFAULTS.address1,
          city: SIGN_UP_DEFAULTS.city,
          state: SIGN_UP_DEFAULTS.state,
          postalCode: SIGN_UP_DEFAULTS.postalCode,
          dateOfBirth: SIGN_UP_DEFAULTS.dateOfBirth,
          ssn: SIGN_UP_DEFAULTS.ssn,
          email: data.email,
          password: data.password,
        };

        const newUser = await signUp(userData);
        if (!newUser) {
          setSubmitError("Couldn't create your account. Please try again.");
          return;
        }
        router.push("/onboarding");
        return;
      }
      if (isSignIn) {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        if (!response) {
          setSubmitError("Invalid email or password.");
          return;
        }
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="flex cursor-pointer items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Horizon Logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {isSignIn ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">Please enter your details</p>
          {isSignUp && (
            <p className="text-14 text-gray-500">
              Additional profile details will be filled automatically during signup.
            </p>
          )}
        </div>
      </header>

      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isSignUp && (
              <>
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="flex-1">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="flex-1">
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
              </>
            )}

            <CustomInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter your email"
              inputType="email"
              autoComplete="email"
            />

            <CustomInput
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete={isSignIn ? "current-password" : "new-password"}
            />

            {submitError && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-14 text-red-700"
              >
                {submitError}
              </div>
            )}

            <div className="flex flex-col gap-4">
              <Button type="submit" className="form-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    {isSignIn ? "Signing in..." : "Creating account..."}
                  </>
                ) : isSignIn ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <footer className="flex justify-center gap-1">
          <p className="text-14 font-normal text-gray-600">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
          </p>

          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="form-link"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </footer>
      </>
    </section>
  );
}

export default AuthForm;
