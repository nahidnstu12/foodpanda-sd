'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Clock,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import CustomizationGroup from './customization-group';

interface MenuItemDetailProps {
  menuItem: any;
}

export function MenuItemDetail({ menuItem }: MenuItemDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<
    Record<string, string[]>
  >({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Initialize required customizations
  useState(() => {
    const initial: Record<string, string[]> = {};
    menuItem.customizations.forEach((custom: any) => {
      if (custom.is_required && custom.choices.length > 0) {
        // Auto-select first available choice for required single-select
        if (custom.max_selection === 1) {
          const firstAvailable = custom.choices.find(
            (c: any) => c.is_available
          );
          if (firstAvailable) {
            initial[custom.id] = [firstAvailable.id];
          }
        }
      }
    });
    setSelectedChoices(initial);
  });

  // Calculate total price
  const calculatedPrice = useMemo(() => {
    let total = menuItem.price;

    // Add price changes from selected choices
    Object.entries(selectedChoices).forEach(([customizationId, choiceIds]) => {
      const customization = menuItem.customizations.find(
        (c: any) => c.id === customizationId
      );
      if (customization) {
        choiceIds.forEach((choiceId) => {
          const choice = customization.choices.find(
            (ch: any) => ch.id === choiceId
          );
          if (choice) {
            total += choice.price_change;
          }
        });
      }
    });

    return total * quantity;
  }, [menuItem, selectedChoices, quantity]);

  // Handle choice selection
  const handleChoiceChange = (
    customizationId: string,
    choiceId: string,
    maxSelection: number
  ) => {
    setSelectedChoices((prev) => {
      const current = prev[customizationId] || [];

      if (maxSelection === 1) {
        // Radio behavior - replace selection
        return { ...prev, [customizationId]: [choiceId] };
      } else {
        // Checkbox behavior - toggle selection
        const exists = current.includes(choiceId);
        if (exists) {
          return {
            ...prev,
            [customizationId]: current.filter((id) => id !== choiceId),
          };
        } else {
          if (current.length < maxSelection) {
            return { ...prev, [customizationId]: [...current, choiceId] };
          }
          return prev; // Max reached
        }
      }
    });
  };

  // Validate if all required customizations are selected
  const isValid = useMemo(() => {
    return menuItem.customizations.every((custom: any) => {
      if (!custom.is_required) return true;
      const selected = selectedChoices[custom.id] || [];
      return selected.length >= custom.min_selection;
    });
  }, [menuItem.customizations, selectedChoices]);

  const handleAddToCart = () => {
    const cartItem = {
      menu_item_id: menuItem.id,
      quantity,
      selected_choices: Object.entries(selectedChoices).map(
        ([customization_id, choice_ids]) => ({
          customization_id,
          choice_ids,
        })
      ),
      calculated_price: calculatedPrice,
      special_instructions: specialInstructions || undefined,
    };

    console.log('Adding to cart:', cartItem);
    // TODO: Add to cart context/state
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-20 z-40">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <Link href={`/resturant/2`}>
            <Button variant="ghost" className="hover:bg-[#06C167]/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Restaurant
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Item Details */}
          <div>
            {/* Item Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
              <Image
                src={menuItem.image_url}
                alt={menuItem.name}
                fill
                className="object-cover"
                priority
              />
              {menuItem.search_tags.includes('vegetarian') && (
                <Badge className="absolute top-4 left-4 bg-[#06C167] hover:bg-[#06C167] text-white">
                  🌱 Vegetarian
                </Badge>
              )}
            </div>

            {/* Restaurant Info */}
            <Card className="border-[#06C167]/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                    <Image
                      src={menuItem.category.menu.restaurant.logo_url}
                      alt={menuItem.category.menu.restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1C1C1C]">
                      {menuItem.category.menu.restaurant.name}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-[#FFC107] text-[#FFC107]" />
                        {menuItem.category.menu.restaurant.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {menuItem.category.menu.restaurant.delivery_time}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Item Info */}
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-[#1C1C1C] mb-2">
                {menuItem.name}
              </h1>
              <p className="text-[#9CA3AF] mb-4">{menuItem.description}</p>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {menuItem.search_tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-[#06C167]/10 text-[#06C167]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Customizations */}
          <div>
            <Card className="border-[#06C167]/10 sticky top-36">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1C1C1C]">
                  Customize Your Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customization Groups */}
                {menuItem.customizations.map((customization: any) => (
                  <CustomizationGroup
                    key={customization.id}
                    customization={customization}
                    selectedChoices={selectedChoices[customization.id] || []}
                    onChoiceChange={(choiceId) =>
                      handleChoiceChange(
                        customization.id,
                        choiceId,
                        customization.max_selection
                      )
                    }
                  />
                ))}

                <Separator />

                {/* Special Instructions */}
                <div>
                  <Label className="text-[#1C1C1C] font-medium mb-2 block">
                    Special Instructions (Optional)
                  </Label>
                  <Textarea
                    placeholder="Any special requests? Let us know..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <Separator />

                {/* Quantity & Price */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[#1C1C1C] font-medium">
                      Quantity
                    </Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-10 w-10 border-[#06C167]/20"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-semibold text-[#1C1C1C] w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        className="h-10 w-10 border-[#06C167]/20"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-2xl font-bold">
                    <span className="text-[#1C1C1C]">Total</span>
                    <span className="text-[#06C167]">৳ {calculatedPrice}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full bg-[#06C167] hover:bg-[#05a855] text-white font-semibold py-6 text-lg"
                  onClick={handleAddToCart}
                  disabled={!isValid || !menuItem.is_available}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {!menuItem.is_available
                    ? 'Not Available'
                    : !isValid
                    ? 'Select Required Options'
                    : `Add to Cart • ৳ ${calculatedPrice}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
