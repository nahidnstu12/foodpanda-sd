// ============================================================================
// FILE: seed/utils/faker-helpers.ts
// ============================================================================

import { faker } from '@faker-js/faker';

export const addPriceVariation = (basePrice: number): number => {
  // Add ±10% variation
  const variation = basePrice * (0.9 + Math.random() * 0.2);
  return Math.round(variation * 100) / 100; // Round to 2 decimals
};

export const generateRating = (): number => {
  // Generate rating between 3.5 and 5.0
  const rating = 3.5 + Math.random() * 1.5;
  return Math.round(rating * 10) / 10; // Round to 1 decimal
};

export const isAvailable = (availability: number = 0.9): boolean => {
  // Default 90% availability
  return Math.random() < availability;
};

export const pickRandom = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const generateRestaurantName = (
  template: string,
  location: string
): string => {
  return `${template} - ${location}`;
};

export const generateCompanyName = (restaurantName: string): string => {
  return `${restaurantName} LLC`;
};

export const generatePhoneNumber = (): string => {
  return faker.phone.number({ style: 'international' });
};

export const generateLogoUrl = (restaurantName: string): string => {
  // Use a placeholder service or return null
  const seed = restaurantName.replace(/\s/g, '-').toLowerCase();
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
};

export const generateCoverImageUrl = (cuisine: string): string => {
  const seed = cuisine.toLowerCase();
  return `https://source.unsplash.com/800x400/?${seed},restaurant`;
};

export const locationSuffixes = [
    "Dhanmondi",
    "Gulshan",
    "Banani",
    "Uttara",
    "Mirpur",
    "Mohammadpur",
    "Bashundhara",
    "Motijheel",
    "Lalmatia",
    "Badda",
    "Baridhara",
    "Tejgaon",
    "Farmgate",
    "Kawran Bazar",
    "Mohakhali",
    "Panthapath",
    "Shantinagar",
    "Malibagh",
    "Rampura",
    "Khilgaon",
    "Banasree",
    "Elephant Road",
    "New Market",
    "Azimpur",
    "Green Road",
  ];