"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { loginFormSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FormInput } from "../form/form-input";
import { FormPasswordInput } from "../form/form-password-input";
import FormProvider from "../form/form-provider";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    const formDataObject = Object.fromEntries(formData);
    console.log("Form data:", formDataObject);
    startTransition(async () => {
      try {
        const result = await signIn.email({
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        });

        console.log("result>>", result);

        if (result.data?.user && !result.error) {
          console.log("Login successful:", result.data.user);
        } else {
          // Handle specific errors from the library if they exist
          const errorMessage =
            result.error?.message || "Invalid email or password.";
          setError(errorMessage);
        }
      } catch (err) {
        console.error("Form submission error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleSuccess = (data: any) => {
    console.log("Login successful:", data);
    setError(null);

    // Show success toast
    toast.success("Login successful! Redirecting...");

    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  const handleError = (errorMessage: string) => {
    console.error("Login error:", errorMessage);
    setError(errorMessage);
  };
  const FormContent = ({ isPending }: { isPending: boolean }) => {
    return (
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <FormInput
            name="email"
            label="Email"
            placeholder="Enter email address"
            type="email"
          />
          <FormPasswordInput
            name="password"
            label="Password"
            placeholder="Enter password (min 8 characters)"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md m-auto space-y-4 shadow p-8 bg-yellow-50 rounded-md">
      <div className="text-2xl font-bold text-center mb-4">Create Account</div>

      {/* <FormProvider
        onSubmit={handleSubmit}
        resolver={zodResolver(loginFormSchema)}
        formName="Login"
        onSuccess={handleSuccess}
        onError={handleError}
      >
        <FormContent isPending={false} />
      </FormProvider> */}
      <form action={handleSubmit}>
        <FormContent isPending={false} />
      </form>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline font-medium">
          Sign Up
        </a>
      </div>
    </div>
  );
}
