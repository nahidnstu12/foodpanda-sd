// import Login from '@/components/pages/login';
// import db from '@/lib/prisma';
// import React from 'react';

// export default async function page() {

//   return (
//     <div className="flex h-screen items-center justify-center">
//       <Login />
//     </div>
//   );
// }

"use client";

import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await signIn.email({
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        });

        console.log("result>>", result);

        if (result.data?.user && !result.error) {
          console.log("Login successful:", result.data.user);
          setSuccess(true);

          router.push("/dashboard");
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
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4 text-white">
      <h1 className="text-2xl font-bold">Login</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={8}
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200"
        >
          Log In
        </button>
      </form>
    </main>
  );
}
