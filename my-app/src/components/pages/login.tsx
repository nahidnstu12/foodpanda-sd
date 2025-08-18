"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md m-auto space-y-4 shadow p-8 bg-yellow-50 rounded-md">
      <div className="text-2xl font-bold text-center mb-4">Login</div>
      <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring pl-2">
        <MailIcon className="h-5 w-5 text-muted-foreground" />
        <Input
          type="email"
          placeholder="Email"
          className="border-0 focus-visible:ring-0 shadow-none"
        />
      </div>
      <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring px-2">
        <LockIcon className="h-5 w-5 text-muted-foreground" />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="border-0 focus-visible:ring-0 shadow-none"
        />
        <button onClick={togglePasswordVisibility}>
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <EyeIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
      </div>
      <Button className="w-full">Log In</Button>
    </div>
  );
}
