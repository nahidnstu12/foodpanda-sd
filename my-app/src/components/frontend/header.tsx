'use client';

import Link from 'next/link';
import { Search, MapPin, ShoppingCart, User, Menu, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [location, setLocation] = useState('Dhanmondi');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#1C1C1C] text-white">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        {/* Mobile Menu */}
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
              <Link href="/restaurants" className="text-lg font-medium hover:text-[#06C167]">
                Restaurants
              </Link>
              <Link href="/offers" className="text-lg font-medium hover:text-[#06C167]">
                Offers
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold">
            <span className="text-[#06C167]">Food</span>
            <span className="text-white">Hub</span>
          </div>
        </Link>

        {/* Location Selector (Desktop) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="hidden lg:flex text-white hover:bg-white/10">
              <MapPin className="mr-2 h-4 w-4 text-[#06C167]" />
              <span className="max-w-[120px] truncate">{location}</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem onClick={() => setLocation('Dhanmondi')}>
              Dhanmondi
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation('Gulshan')}>
              Gulshan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation('Banani')}>
              Banani
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation('Uttara')}>
              Uttara
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Bar (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <Input
              type="search"
              placeholder="Search for restaurants or dishes..."
              className="w-full pl-10 bg-white/10 border-white/20 text-white placeholder:text-[#9CA3AF] focus:bg-white focus:text-[#1C1C1C]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="lg:hidden text-white">
            <Search className="h-5 w-5" />
          </Button>

          {/* Sign In */}
          <Button variant="ghost" className="hidden lg:flex text-white hover:bg-white/10">
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Button>

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