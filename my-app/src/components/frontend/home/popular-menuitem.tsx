"use client";

import { useState } from "react";
import { Star, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";

// Mock data - replace with actual API call
// Adjusted to align with Prisma schema fields: image_url, search_tags, is_available
const mockMenuItems = Array.from({ length: 20 }, (_, i) => ({
  id: `item-${i + 1}`,
  name:
    i % 3 === 0
      ? "Margherita Pizza"
      : i % 3 === 1
      ? "Spaghetti Carbonara"
      : "Chicken Burger",
  restaurant: "Pizza Palace - Dhanmondi",
  price: 299 + i * 50,
  rating: 4.2 + (i % 8) * 0.1,
  image_url:
    i % 3 === 0
      ? "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=300&fit=crop"
      : i % 3 === 1
      ? "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300&h=300&fit=crop"
      : "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop",
  search_tags: i % 2 === 0 ? ["vegetarian"] : ["bestseller"],
  is_available: true,
  category: i % 3 === 0 ? "pizza" : i % 3 === 1 ? "pasta" : "burger",
}));

export function PopularMenuItems() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [displayCount, setDisplayCount] = useState(6);

  const filteredItems =
    activeFilter === "all"
      ? mockMenuItems
      : mockMenuItems.filter((item) => item.category === activeFilter);

  const displayedItems = filteredItems.slice(0, displayCount);

  const loadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 8, filteredItems.length));
  };

  return (
    <section className="py-12 bg-[#F9FAFB]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-2">
            What's on your mind?
          </h2>
          <p className="text-[#9CA3AF]">
            Explore delicious dishes from top restaurants
          </p>
        </div>

        {/* Filter Tabs */}
        <Tabs
          value={activeFilter}
          onValueChange={setActiveFilter}
          className="mb-8"
        >
          <TabsList className="bg-white border border-[#06C167]/10">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-[#06C167] data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="pizza"
              className="data-[state=active]:bg-[#06C167] data-[state=active]:text-white"
            >
              🍕 Pizza
            </TabsTrigger>
            <TabsTrigger
              value="pasta"
              className="data-[state=active]:bg-[#06C167] data-[state=active]:text-white"
            >
              🍝 Pasta
            </TabsTrigger>
            <TabsTrigger
              value="burger"
              className="data-[state=active]:bg-[#06C167] data-[state=active]:text-white"
            >
              🍔 Burger
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
          {displayedItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Load More */}
        {displayCount < filteredItems.length && (
          <div className="text-center">
            <Button
              onClick={loadMore}
              variant="outline"
              size="lg"
              className="border-[#06C167] text-[#06C167] hover:bg-[#06C167] hover:text-white"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function MenuItemCard({ item }: { item: any }) {
  return (
    <Link href={`/resturant/2/${item.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-[#06C167]/10">
        <div className="relative h-[240px] overflow-hidden">
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {/* top-left stacked badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {item.search_tags.includes("vegetarian") && (
              <Badge className="bg-[#06C167] hover:bg-[#06C167]">🌱 Veg</Badge>
            )}
            {item.search_tags.includes("bestseller") && (
              <Badge className="bg-[#FF6B6B] hover:bg-[#FF6B6B]">
                ⭐ Bestseller
              </Badge>
            )}
          </div>

          {/* gradient hover overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* rating chip */}
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-[#1C1C1C] shadow">
            <Star className="h-3.5 w-3.5 text-yellow-500" />
            <span>{Number(item.rating).toFixed(1)}</span>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="mb-1 flex items-start justify-between gap-3">
            <h3 className="text-sm md:text-base font-semibold text-[#1C1C1C] line-clamp-1">
              {item.name}
            </h3>
          </div>
          <p className="text-xs text-[#9CA3AF] line-clamp-1 mb-3">
            {item.restaurant}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-base font-bold text-[#1C1C1C]">
              ৳{Number(item.price).toLocaleString("en-BD")}
            </div>
            <Button size="icon" className="bg-[#06C167] hover:bg-[#06C167]">
              <Plus className="h-4 w-4 text-white" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
