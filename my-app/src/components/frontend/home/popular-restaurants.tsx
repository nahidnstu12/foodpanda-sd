"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import type { PopularRestaurantDTO } from "@/types/restaurant.types";

const mockRestaurants = [
  {
    id: "1",
    name: "Pizza Palace - Dhanmondi",
    location: "Dhanmondi",
    cuisine: "Italian, Fast Food",
    rating: 4.5,
    deliveryTime: "30-40 min",
    cover_image_url:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    isFeatured: true,
  },
];

export function PopularRestaurants({
  restaurants = [],
}: {
  restaurants?: PopularRestaurantDTO[];
}) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C1C]">
              Popular Restaurants Near You
            </h2>
            <p className="text-[#9CA3AF] mt-1">
              Top-rated places loved by customers
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="border-[#06C167]/20 hover:border-[#06C167] hover:bg-[#06C167]/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="border-[#06C167]/20 hover:border-[#06C167] hover:bg-[#06C167]/10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          >
            {restaurants.length > 0 ? (
              restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))
            ) : (
              <div className="flex h-[200px] w-full items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
                No popular restaurants yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function RestaurantCard({ restaurant }: { restaurant: PopularRestaurantDTO }) {
  return (
    <Link href={`/resturant/${restaurant.id}`} className="block">
      <Card className="w-[280px] shrink-0 overflow-hidden hover:shadow-xl transition-all duration-300 group border-[#06C167]/10">
        <div className="relative h-[180px] overflow-hidden">
          <Image
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {restaurant.isFeatured && (
            <Badge className="absolute top-3 right-3 bg-[#FF6B6B] hover:bg-[#FF6B6B]">
              Featured
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardContent className="p-4">
          <h3 className="text-base font-semibold text-[#1C1C1C] mb-2 line-clamp-1">
            {restaurant.name}
          </h3>
          <p className="text-sm text-[#9CA3AF] flex items-center mb-3">
            <MapPin className="h-3 w-3 mr-1" />
            {restaurant.location}
          </p>
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="flex items-center text-[#1C1C1C] font-medium">
              <Star className="h-4 w-4 fill-[#FFC107] text-[#FFC107] mr-1" />
              {(restaurant.rating ?? 0).toFixed(1)}
            </span>
            <span className="flex items-center text-[#9CA3AF]">
              <Clock className="h-3 w-3 mr-1" />
              {restaurant.deliveryTime}
            </span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {(restaurant.cuisine || "")
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
              .map((item: string) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="text-xs bg-[#06C167]/10 text-[#06C167] hover:bg-[#06C167]/20"
                >
                  {item}
                </Badge>
              ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
