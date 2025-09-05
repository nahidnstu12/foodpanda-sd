"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Home } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function HomeButton() {
  const { user } = useAuthStore();
  const route = user?.selected_role
    ? `/${user.selected_role.toLowerCase()}/dashboard`
    : "/customer/dashboard";
  return (
    <Button asChild variant="outline" className="flex-1">
      <Link
        href={route}
        className="flex items-center justify-center gap-2"
      >
        <Home className="w-4 h-4" />
        Dashboard
      </Link>
    </Button>
  );
}
