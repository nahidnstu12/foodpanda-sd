import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import InputError from "./input-error";
import { cn } from "@/lib/utils";

interface FormInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  [x: string]: any; // for extra props
}

export function FormPasswordInput({
  name,
  label,
  type = "text",
  placeholder,
  ...rest
}: FormInputProps) {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          {label && <Label htmlFor={name}>{label}</Label>}
          <div className="relative">
            <Input
              id={name}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              {...field}
              {...rest}
              className={cn(
                fieldState.error && "border-red-500",
                rest.className
              )}
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
          {fieldState.error && (
            <InputError message={fieldState.error.message} />
          )}
        </div>
      )}
    />
  );
}
