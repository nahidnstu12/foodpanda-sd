import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";

export default async function TestSessionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("Test session:", session);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Session Test Page</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Session Data:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>

        {session ? (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <p className="text-green-800">✅ Session found!</p>
            <p>
              <strong>User:</strong> {session.user?.email}
            </p>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-red-100 rounded">
            <p className="text-red-800">❌ No session found</p>
          </div>
        )}
      </div>
    </div>
  );
}
