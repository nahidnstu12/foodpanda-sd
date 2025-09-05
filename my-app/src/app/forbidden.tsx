"use client";
import { GoBack } from "@/components/shared/go-back";
import HomeButton from "@/components/shared/home-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { HelpCircle, Home, Mail, ShieldX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-lg w-full">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="w-10 h-10 text-red-500" />
            </div>

            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Access Denied
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                You don't have permission to view this page
              </CardDescription>
            </div>

            <Badge variant="destructive" className="w-fit mx-auto">
              Error 403
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    What does this mean?
                  </p>
                  <p>
                    This page requires specific permissions that your current
                    role doesn't include. This is a security measure to protect
                    sensitive information.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">What you can do:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  Go back to your dashboard
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  Contact your administrator for access
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  Check if you're logged in with the correct account
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* <Button
                // asChild
                variant="outline"
                className="flex-1"
              >
                <Link
                  href={route}
                  className="flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
              </Button> */}
              <HomeButton />
              <GoBack />
            </div>

            <div className="pt-4 border-t">
              <Button asChild variant="ghost" size="sm" className="w-full">
                <Link
                  href="mailto:support@foodpanda.com"
                  className="flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
