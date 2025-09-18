import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import InputError from "./input-error";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

interface FormInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  variant?: "input" | "textarea";
  [x: string]: any; // for extra props
}

export function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  variant = "input",
  ...rest
}: FormInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          {label && <Label htmlFor={name}>{label}</Label>}
          {variant === "input" ? (
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              {...field}
              {...rest}
              className={cn(
                fieldState.error && "border-red-500",
                rest.className
              )}
            />
          ) : (
            <Textarea
              id={name}
              placeholder={placeholder}
              {...field}
              {...rest}
              className={cn(
                fieldState.error && "border-red-500",
                rest.className
              )}
            />
          )}
          {fieldState.error && (
            <InputError message={fieldState.error.message} />
          )}
        </div>
      )}
    />
  );
}
