"use client";

import { loginAction } from "@/actions/auth";
import { FormPasswordInputServer } from "@/components/form/form-password-input-server";
import FormSubmitButton from "@/components/form/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import { UserType } from "../../../../generated/prisma";
import { useAuthStore } from "@/store/authStore";

const initialState = {
  success: false,
  message: "",
};

export default function Page() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const { user } = useAuthStore();

  const { data: session } = useSession();
  console.log("login page user>>", user, session);

  if (session) {
    const role = (session.user as any)?.roles?.[0];
    console.log("login page role>>", role);
    const redirectTo =
      role === UserType.SUPER_ADMIN
        ? "/dashboard/super-admin"
        : role === UserType.ADMIN
        ? "/dashboard/admin"
        : role === UserType.PARTNER
        ? "/dashboard/partner"
        : role === UserType.RIDER
        ? "/dashboard/rider"
        : "/dashboard/customer";
    redirect(redirectTo);
  }
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md m-auto space-y-6 shadow p-8 bg-yellow-50 rounded-md">
        <div className="text-2xl font-bold text-center mb-2">Log In</div>

        {state.message && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="password">Password</Label>
              <FormPasswordInputServer
                name="password"
                placeholder="Enter password (min 8 characters)"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="pt-4">
            <FormSubmitButton>Log In</FormSubmitButton>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
