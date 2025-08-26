import Signup from "@/components/pages/signup";

export default function page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Signup />
    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { signUp } from '@/lib/auth-client';
// import { useTransition } from 'react';
// import { signUpAction } from '@/actions/auth';

// export default function SignUpPage() {
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
//         const result = await signUpAction(formData);

//         if (result.success) {
//           console.log('Signup successful:', result.data);
//           setSuccess(true);

//           // Redirect after showing success message
//           setTimeout(() => {
//             router.push('/sign-in?message=Account created successfully');
//           }, 2000);
//         } else {
//           setError(result.error || 'Something went wrong');
//         }
//       } catch (err) {
//         console.error('Form submission error:', err);
//         setError('An unexpected error occurred. Please try again.');
//       }
//     });
//   }

//   return (
//     <main className="max-w-md mx-auto p-6 space-y-4 text-white">
//       <h1 className="text-2xl font-bold">Sign Up</h1>

//       {error && <p className="text-red-500">{error}</p>}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="name"
//           placeholder="Username"
//           required
//           className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
//         />
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
//         <select name="user_type" id="user_type" className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2">
//           <option value="CUSTOMER">Customer</option>
//           <option value="RIDER">Rider</option>
//           <option value="PARTNER">Partner</option>
//         </select>
//         <button
//           type="submit"
//           className="w-full bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200"
//         >
//           Create Account
//         </button>
//       </form>
//     </main>
//   );
// }
