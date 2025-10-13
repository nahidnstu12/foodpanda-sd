
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/frontend/header';
import { Footer } from '@/components/frontend/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FoodHub - Order Food Online',
  description: 'Order from the best restaurants near you',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-[#F9FAFB]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

