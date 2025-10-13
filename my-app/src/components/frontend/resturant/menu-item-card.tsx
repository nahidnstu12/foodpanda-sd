'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Plus, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: any;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => {
    setQuantity(quantity + 1);
  };

  const handleRemove = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Link href={`/resturant/2/${item.id}`}>
      <Card
        className={cn(
          'overflow-hidden hover:shadow-lg transition-all duration-300 border-[#06C167]/10',
          !item.isAvailable && 'opacity-60'
        )}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Item Details - Left Side */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h3 className="text-lg font-semibold text-[#1C1C1C] line-clamp-1">
                  {item.name}
                </h3>
                {item.tags.includes('vegetarian') && (
                  <Badge className="shrink-0 bg-[#06C167] hover:bg-[#06C167] px-2 py-0 text-xs">
                    🌱
                  </Badge>
                )}
              </div>

              <p className="text-sm text-[#9CA3AF] mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center gap-3 mb-3">
                {item.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-[#FFC107] text-[#FFC107]" />
                    <span className="text-sm font-medium text-[#1C1C1C]">
                      {item.rating}
                    </span>
                  </div>
                )}
                {item.tags.includes('bestseller') && (
                  <Badge className="bg-[#FF6B6B] hover:bg-[#FF6B6B] text-xs">
                    Bestseller
                  </Badge>
                )}
                {item.tags.includes('popular') && (
                  <Badge className="bg-[#06C167]/10 text-[#06C167] hover:bg-[#06C167]/20 text-xs">
                    Popular
                  </Badge>
                )}
                {item.tags.includes('spicy') && (
                  <Badge variant="secondary" className="text-xs">
                    🌶️ Spicy
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#1C1C1C]">
                  ৳ {item.price}
                </span>

                {item.isAvailable ? (
                  quantity === 0 ? (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAdd();
                      }}
                      className="bg-[#06C167] hover:bg-[#05a855]"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 bg-[#06C167] rounded-lg">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove();
                        }}
                        className="h-8 w-8 text-white hover:bg-white/20"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-white font-semibold w-8 text-center">
                        {quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAdd();
                        }}
                        className="h-8 w-8 text-white hover:bg-white/20"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Not Available
                  </Badge>
                )}
              </div>
            </div>

            {/* Item Image - Right Side */}
            <div className="relative h-32 w-32 shrink-0 rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}