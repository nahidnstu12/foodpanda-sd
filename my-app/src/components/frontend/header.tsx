'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Menu, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { signOut, useSession } from '@/lib/auth-client';
import { useAuthStore } from '@/store/authStore';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function DropdownMenuWithIcon() {
  const { data: session } = useSession();
  const name = session?.user?.name;
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-full text-white bg-black">
        <Avatar>
          <AvatarFallback className="bg-[#06C167] hover:bg-[#05a855] text-white">
            {name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => {
          router.push('/dashboard');
        }}>
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={() => {
          signOut();
        }}>
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="/" className="text-lg font-medium hover:text-[#06C167]">
            Home
          </Link>
          <Link
            href="/restaurants"
            className="text-lg font-medium hover:text-[#06C167]"
          >
            Restaurants
          </Link>
          <Link
            href="/offers"
            className="text-lg font-medium hover:text-[#06C167]"
          >
            Offers
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [location, setLocation] = useState('Dhanmondi');
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: session } = useSession();
  console.log('session user', session);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#1C1C1C] text-white">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        {/* Mobile Menu */}
        <MobileMenu />

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold">
            <span className="text-[#06C167]">Food</span>
            <span className="text-white">Hub</span>
          </div>
        </Link>

        <nav className="flex gap-8 items-center">
          <Link
            href="/"
            className="text-lg font-medium hover:text-[#06C167] text-white"
          >
            Home
          </Link>
          <Link
            href="/restaurants"
            className="text-lg font-medium hover:text-[#06C167]"
          >
            Restaurants
          </Link>
          <Link
            href="/offers"
            className="text-lg font-medium hover:text-[#06C167]"
          >
            Offers
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile Search */}
          {/* <Button variant="ghost" size="icon" className="lg:hidden text-white">
            <Search className="h-5 w-5" />
          </Button> */}

          {/* Sign In */}
          {session?.user?.id ? (
            <DropdownMenuWithIcon />
          ) : (
            <Button
              variant="ghost"
              className="hidden lg:flex text-white"
              onClick={() => {
                router.push('/login');
              }}
            >
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}

          {/* Cart */}
          <Link href="/cart">
            <Button
              variant="default"
              size="icon"
              className="relative bg-[#06C167] hover:bg-[#05a855]"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#FF6B6B] text-white text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
