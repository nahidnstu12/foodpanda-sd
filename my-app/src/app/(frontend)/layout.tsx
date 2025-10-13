import { Header } from '@/components/frontend/header';
import { Footer } from '@/components/frontend/footer';

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F9FAFB]">{children}</main>
      <Footer />
    </>
  );
}
