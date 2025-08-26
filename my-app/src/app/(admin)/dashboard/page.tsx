import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("session", session);

  // Redirect if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {session.user?.email}
          </p>
          <p>
            <strong>Name:</strong> {session.user?.name || "Not provided"}
          </p>
          <p>
            <strong>Status:</strong> {session.user?.status || "Unknown"}
          </p>
          <p>
            <strong>Phone Verified:</strong>{" "}
            {session.user?.is_phone_verified ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}
