"use client";

import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

export default function FormSubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className={cn("w-full", className)}
      disabled={pending}
    >
      {pending ? "Submitting..." : children}
    </Button>
  );
}
