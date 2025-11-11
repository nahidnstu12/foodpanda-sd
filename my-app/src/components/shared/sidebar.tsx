import { AppSidebar } from '@/components/app-sidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export default async function Sidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-gray-200">
          <div className="flex justify-between items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Link href="/" className=" text-sm font-medium">
              View Site
            </Link>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
