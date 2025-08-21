// import { auth } from "@/lib/auth";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { redirect } from "next/navigation";

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<{ error?: string; clear?: string }>;
// }) {
//   async function login(formData: FormData) {
//     "use server";

//     const email = (formData.get("email") as string | null)?.trim();
//     const password = formData.get("password") as string | null;

//     if (!email || !password) {
//       redirect(
//         "/login?error=" + encodeURIComponent("Email and password are required")
//       );
//     }

//     try {
//       const result = await auth.api.signInEmail({
//         body: { email, password },
//       });

//       if (result?.user) {
//         redirect("/dashboard");
//       }
//     } catch (e: any) {
//       const message = e?.message || "Invalid email or password";
//       redirect("/login?error=" + encodeURIComponent(message));
//     }

//     redirect("/login?error=" + encodeURIComponent("Invalid email or password"));
//   }

//   async function clearError() {
//     "use server";
//     redirect("/login");
//   }

//   const { error } = await searchParams;

//   return (
//     <div className="flex h-screen items-center justify-center">
//       <div className="w-full max-w-md m-auto space-y-6 shadow p-8 bg-yellow-50 rounded-md">
//         <div className="text-2xl font-bold text-center mb-2">Log In</div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
//             {error}
//             <form action={clearError} className="inline ml-2">
//               <button
//                 type="submit"
//                 className="text-red-500 hover:text-red-700 underline"
//               >
//                 ✕
//               </button>
//             </form>
//           </div>
//         )}

//         <form action={login} className="space-y-4">
//           <div className="grid grid-cols-1 gap-4">
//             <div className="flex flex-col gap-1">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="Enter email address"
//                 required
//               />
//             </div>
//             <div className="flex flex-col gap-1">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="Enter password (min 8 characters)"
//                 required
//                 minLength={8}
//               />
//             </div>
//           </div>

//           <div className="pt-4">
//             <Button type="submit" className="w-full">
//               Log In
//             </Button>
//           </div>
//         </form>

//         <div className="text-center text-sm text-gray-600">
//           Don't have an account?{" "}
//           <a
//             href="/signup"
//             className="text-blue-600 hover:underline font-medium"
//           >
//             Sign Up
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { auth } from "@/lib/auth";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { redirect } from "next/navigation";

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<{ error?: string; clear?: string }>;
// }) {
//   async function login(formData: FormData) {
//     "use server";

//     const email = (formData.get("email") as string | null)?.trim();
//     const password = formData.get("password") as string | null;

//     // Validation
//     if (!email || !password) {
//       redirect(
//         "/login?error=" + encodeURIComponent("Email and password are required")
//       );
//       return; // This return is technically unreachable but good practice
//     }

//     try {
//       const result = await auth.api.signInEmail({
//         body: { email, password },
//       });
//       console.log("result>>", result);
//       if (result?.user) {
//         redirect("/dashboard");
//         return; // This return is technically unreachable but good practice
//       } else {
//         // Handle case where no user is returned but no error is thrown
//         redirect("/login?error=" + encodeURIComponent("Invalid email or password"));
//         return;
//       }
//     } catch (e: any) {
//       console.log("e>>", e);
//       const message = e?.message || "Invalid email or password";
//       redirect("/login?error=" + encodeURIComponent(message));
//       return; // This return is technically unreachable but good practice
//     }

//     // Remove this line - it was causing the issue
//     // redirect("/login?error=" + encodeURIComponent("Invalid email or password"));
//   }

//   async function clearError() {
//     "use server";
//     redirect("/login");
//   }

//   const { error } = await searchParams;

//   return (
//     <div className="flex h-screen items-center justify-center">
//       <div className="w-full max-w-md m-auto space-y-6 shadow p-8 bg-yellow-50 rounded-md">
//         <div className="text-2xl font-bold text-center mb-2">Log In</div>

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
//             {error}
//             <form action={clearError} className="inline ml-2">
//               <button
//                 type="submit"
//                 className="text-red-500 hover:text-red-700 underline"
//               >
//                 ✕
//               </button>
//             </form>
//           </div>
//         )}

//         <form action={login} className="space-y-4">
//           <div className="grid grid-cols-1 gap-4">
//             <div className="flex flex-col gap-1">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="Enter email address"
//                 required
//               />
//             </div>
//             <div className="flex flex-col gap-1">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="Enter password (min 8 characters)"
//                 required
//                 minLength={8}
//               />
//             </div>
//           </div>

//           <div className="pt-4">
//             <Button type="submit" className="w-full">
//               Log In
//             </Button>
//           </div>
//         </form>

//         <div className="text-center text-sm text-gray-600">
//           Don't have an account?{" "}
//           <a
//             href="/signup"
//             className="text-blue-600 hover:underline font-medium"
//           >
//             Sign Up
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

// ---
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; clear?: string }>;
}) {
  async function login(formData: FormData) {
    "use server";

    const email = (formData.get("email") as string | null)?.trim();
    const password = formData.get("password") as string | null;

    // Validation
    if (!email || !password) {
      redirect(
        "/login?error=" + encodeURIComponent("Email and password are required")
      );
    }

    try {
      const result = await auth.api.signInEmail({
        body: { email, password },
      });

      console.log("result>>", result);
      
      if (result?.user) {
        redirect("/dashboard");
      }
      
      // If no user but no error thrown, redirect with error
      redirect("/login?error=" + encodeURIComponent("Invalid email or password"));
      
    } catch (e: any) {
      // Check if this is a redirect error (normal Next.js behavior)
      if (e.message === 'NEXT_REDIRECT') {
        throw e; // Re-throw redirect errors - they're not actual errors
      }
      
      // Handle actual authentication errors
      const message = e?.message || "Invalid email or password";
      redirect("/login?error=" + encodeURIComponent(message));
    }
  }

  async function clearError() {
    "use server";
    redirect("/login");
  }

  const { error } = await searchParams;

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md m-auto space-y-6 shadow p-8 bg-yellow-50 rounded-md">
        <div className="text-2xl font-bold text-center mb-2">Log In</div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
            <form action={clearError} className="inline ml-2">
              <button
                type="submit"
                className="text-red-500 hover:text-red-700 underline"
              >
                ✕
              </button>
            </form>
          </div>
        )}

        <form action={login} className="space-y-4">
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
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password (min 8 characters)"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}




// ---

// "use client";

// import { signIn } from "@/lib/auth-client";
// import { useRouter } from "next/navigation";
// import { useState, useTransition } from "react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [isPending, startTransition] = useTransition();

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError(null);

//     const formData = new FormData(e.currentTarget);

//     startTransition(async () => {
//       try {
//         const result = await signIn.email({
//           email: formData.get("email") as string,
//           password: formData.get("password") as string,
//         });

//         console.log("result>>", result);

//         if (result.data?.user && !result.error) {
//           console.log("Login successful:", result.data.user);
//           setSuccess(true);

//           router.push("/dashboard");
//         } else {
//           // Handle specific errors from the library if they exist
//           const errorMessage =
//             result.error?.message || "Invalid email or password.";
//           setError(errorMessage);
//         }
//       } catch (err) {
//         console.error("Form submission error:", err);
//         setError("An unexpected error occurred. Please try again.");
//       }
//     });
//   }

//   return (
//     <main className="max-w-md mx-auto p-6 space-y-4 text-white">
//       <h1 className="text-2xl font-bold">Login</h1>

//       {error && <p className="text-red-500">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           required
//           className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
//         />
//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           required
//           minLength={8}
//           className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
//         />

//         <button
//           type="submit"
//           className="w-full bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200"
//         >
//           Log In
//         </button>
//       </form>
//     </main>
//   );
// }
