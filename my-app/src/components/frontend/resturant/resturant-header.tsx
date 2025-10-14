"use client";

import Image from "next/image";
import { Star, Clock, MapPin, Share2, Heart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface RestaurantHeaderProps {
  restaurant: any;
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <div className="relative bg-white">
      {/* Cover Image */}
      <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden">
        <Image
          src={restaurant.cover_image_url}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Status Badge */}
        {restaurant.isOpen ? (
          <Badge className="absolute top-4 right-4 bg-[#06C167] text-white px-4 py-2">
            Open Now
          </Badge>
        ) : (
          <Badge className="absolute top-4 right-4 bg-[#FF6B6B] text-white px-4 py-2">
            Closed
          </Badge>
        )}
      </div>

      {/* Restaurant Info */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative -mt-20 md:-mt-24">
          {/* Logo */}
          <div className="mb-4">
            <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
              <Image
                src={restaurant.logo_url}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Info Card */}
          <Card className="p-6 mb-6 border-[#06C167]/10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Left Side - Details */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-2">
                  {restaurant.name}
                </h1>
                <p className="text-[#9CA3AF] mb-4">{restaurant.description}</p>

                <div className="flex items-center gap-2 text-[#9CA3AF] mb-4">
                  <MapPin className="h-4 w-4 text-[#06C167]" />
                  <span className="text-sm">{restaurant.location}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-[#FFC107] text-[#FFC107]" />
                    <span className="font-semibold text-[#1C1C1C]">
                      {restaurant.rating}
                    </span>
                    <span className="text-sm text-[#9CA3AF]">
                      ({restaurant.totalReviews}+ ratings)
                    </span>
                  </div>

                  {/* Delivery Time */}
                  <div className="flex items-center gap-1 text-[#9CA3AF]">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{restaurant.deliveryTime}</span>
                  </div>

                  {/* Delivery Fee */}
                  <div className="text-sm text-[#9CA3AF]">
                    <span>৳{restaurant.deliveryFee} delivery fee</span>
                  </div>
                </div>

                {/* Cuisine Tags (schema: single string) */}
                <div className="flex flex-wrap gap-2">
                  {(restaurant.cuisine || "")
                    .split(",")
                    .map((c: string) => c.trim())
                    .filter(Boolean)
                    .map((cuisine: string) => (
                      <Badge
                        key={cuisine}
                        variant="secondary"
                        className="bg-[#06C167]/10 text-[#06C167] hover:bg-[#06C167]/20"
                      >
                        {cuisine}
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Right Side - Actions */}
              <div className="flex lg:flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#06C167]/20 hover:bg-[#06C167]/10"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#06C167]/20 hover:bg-[#06C167]/10"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[#06C167]/20 hover:bg-[#06C167]/10"
                >
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
