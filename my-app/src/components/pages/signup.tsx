"use client";

import { signUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { signupDefaultValues, userTypeOptions } from "@/helpers/default-data";
import { signupFormSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FormProvider as FormProviderRHF, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormInput } from "../form/form-input";
import { FormPasswordInput } from "../form/form-password-input";
import { FormSelect } from "../form/form-select";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [isPending, startTransition] = useTransition();

  const methods = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: signupDefaultValues,
  });

  const handleSubmit = async (data: any) => {
    console.log("Form data:", data);
    startTransition(async () => {
      const result = await signUpAction(data);
      if (result.success) {
        handleSuccess(result.data);
      } else {
        handleError(result.error || "Something went wrong");
      }
    });
  };

  const handleSuccess = (data: any) => {
    console.log("Signup successful:", data);
    setSuccess(true);
    setError(null);

    // Show success toast
    toast.success("Account created successfully! Redirecting...");

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  const handleError = (errorMessage: string) => {
    console.error("Signup error:", errorMessage);
    setError(errorMessage);
    setSuccess(false);

    // Show error toast
    toast.error(errorMessage);
  };

  if (success) {
    return (
      <div className="w-full max-w-md m-auto space-y-4 shadow p-8 bg-green-50 rounded-md text-center">
        <div className="text-green-500 text-4xl">✓</div>
        <h2 className="text-2xl font-bold text-green-700">Account Created!</h2>
        <p className="text-green-600">
          Your account has been created successfully. Redirecting to sign-in...
        </p>
      </div>
    );
  }

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
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            type="text"
          />
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
          <FormSelect
            name="user_type"
            label="Account Type"
            options={userTypeOptions}
            placeholder="Select account type"
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
        resolver={zodResolver(signupFormSchema)}
        defaultValues={signupDefaultValues}
        formName="Signup"
        onSuccess={handleSuccess}
        onError={handleError}
      >
        <FormContent isPending={false} />
      </FormProvider> */}
      <FormProviderRHF {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <FormContent isPending={isPending} />
        </form>
      </FormProviderRHF>

      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:underline font-medium"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
