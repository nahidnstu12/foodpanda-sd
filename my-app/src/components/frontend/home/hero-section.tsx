'use client';

import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const quickFilters = [
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🍝', label: 'Pasta' },
  { emoji: '🍔', label: 'Burger' },
  { emoji: '🌮', label: 'Fast Food' },
];

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#06C167]/10 to-transparent py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1C1C1C] mb-4">
          Craving something
          <span className="text-[#06C167]"> delicious</span>?
        </h1>
        <p className="text-xl text-[#9CA3AF] mb-8 max-w-2xl mx-auto">
          Order from the best restaurants near you and get it delivered fast!
        </p>

        {/* Enhanced Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <Card className="p-2 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MapPin className="h-5 w-5 text-[#06C167]" />
                </Button>
                <span className="text-sm text-[#1C1C1C] font-medium">Dhanmondi</span>
              </div>
              <Separator orientation="vertical" className="hidden md:block h-6" />
              <div className="relative flex-1 w-full">
                <Input
                  placeholder="Search for restaurants or dishes..."
                  className="border-0 focus-visible:ring-0 text-base"
                />
              </div>
              <Button size="lg" className="bg-[#06C167] hover:bg-[#05a855] w-full md:w-auto">
                <Search className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Search</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Filters */}
        <div className="flex justify-center gap-3 flex-wrap">
          {quickFilters.map((filter) => (
            <Button
              key={filter.label}
              variant="outline"
              className="rounded-full border-[#06C167]/20 hover:border-[#06C167] hover:bg-[#06C167]/10"
            >
              <span className="mr-2">{filter.emoji}</span>
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
