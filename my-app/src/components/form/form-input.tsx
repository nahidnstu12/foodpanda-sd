import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import InputError from "./input-error";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  [x: string]: any; // for extra props
}

export function FormInput({
  name,
  label,
  type = "text",
  placeholder,
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
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            {...field}
            {...rest}
            className={cn(fieldState.error && "border-red-500", rest.className)}
          />
          {fieldState.error && (
            <InputError message={fieldState.error.message} />
          )}
        </div>
      )}
    />
  );
}
