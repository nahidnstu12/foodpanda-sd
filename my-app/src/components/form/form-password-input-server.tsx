"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

interface FormInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  [x: string]: any; // for extra props
}

export function FormPasswordInputServer({
  name,
  label,
  type = "text",
  placeholder,
  ...rest
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <Input
        id={name}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        {...rest}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
        ) : (
          <EyeIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
