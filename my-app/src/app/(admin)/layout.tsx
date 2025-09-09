import { RouteGuard } from "@/components/shared/route-guard";
import Sidebar from "@/components/shared/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <Sidebar>{children}</Sidebar>
    </RouteGuard>
  );
}
