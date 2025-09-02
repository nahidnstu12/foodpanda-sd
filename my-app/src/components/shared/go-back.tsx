"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function GoBack() {
  const router = useRouter();
  return (
    <Button variant="outline" onClick={() => router.back()} className="flex-1">
      <ArrowLeft className="w-4 h-4 mr-2" />
      Go Back
    </Button>
  );
}
