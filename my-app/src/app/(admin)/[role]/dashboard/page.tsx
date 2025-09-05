import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
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
    <SidebarProvider>
      <AppSidebar />
      {/* <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h1>Dashboard</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset> */}
    </SidebarProvider>
  );
}
