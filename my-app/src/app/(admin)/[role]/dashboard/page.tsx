import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // const user = await db.user.findUnique({
  //   where: { id: session?.session?.userId },
  //   select: {
  //     user_roles: {
  //       select: {
  //         role_permissions: {
  //           select: {
  //             key: true,
  //             name: true,
  //             description: true,
  //             group: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  // const user = await findUserRoles(session?.session?.userId || "");
  const { role } = await params;

  console.log("session dashboard page>>>>>>", session?.user?.name);

  // Redirect if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  );
}
