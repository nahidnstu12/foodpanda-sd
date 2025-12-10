// ============================================================================
// FILE: seed/utils/faker-helpers.ts
// ============================================================================

import { faker } from "@faker-js/faker";

export const addPriceVariation = (basePrice: number): number => {
  // Add ±10% variation
  const variation = basePrice * (0.9 + Math.random() * 0.2);
  return Math.round(variation * 100) / 100; // Round to 2 decimals
};

export const addRestaurantSpecificPriceVariation = (
  basePrice: number,
  restaurantMultiplier: number
): number => {
  // Apply restaurant-specific multiplier first, then add individual item variation
  const restaurantPrice = basePrice * restaurantMultiplier;
  const variation = restaurantPrice * (0.95 + Math.random() * 0.1); // ±5% individual variation
  return Math.round(variation * 100) / 100;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomSubset = <T>(
  array: T[],
  minCount: number,
  maxCount: number
): T[] => {
  const shuffled = shuffleArray(array);
  const count =
    minCount + Math.floor(Math.random() * (maxCount - minCount + 1));
  return shuffled.slice(0, count);
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
  return faker.phone.number({ style: "international" });
};

export const generateLogoUrl = (restaurantName: string): string => {
  // Use a placeholder service or return null
  const seed = restaurantName.replace(/\s/g, "-").toLowerCase();
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;
};

export const generateCoverImageUrl = (cuisine: string): string => {
  const seed = cuisine.toLowerCase();
  return `https://source.unsplash.com/800x400/?${seed},restaurant`;
};

const dhakaReference = { lat: 23.8103, lng: 90.4125 };

const locationCoordinateHints: Record<string, { lat: number; lng: number }> = {
  Dhanmondi: { lat: 23.7461, lng: 90.3742 },
  Gulshan: { lat: 23.7925, lng: 90.4078 },
  Banani: { lat: 23.7946, lng: 90.4031 },
  Uttara: { lat: 23.8767, lng: 90.3203 },
  Mirpur: { lat: 23.8041, lng: 90.3563 },
  Mohammadpur: { lat: 23.76, lng: 90.358 },
  Bashundhara: { lat: 23.8156, lng: 90.4215 },
  Motijheel: { lat: 23.735, lng: 90.4143 },
  Lalmatia: { lat: 23.751, lng: 90.369 },
  Badda: { lat: 23.7806, lng: 90.4266 },
  Baridhara: { lat: 23.81, lng: 90.4123 },
  Tejgaon: { lat: 23.7638, lng: 90.4067 },
  Farmgate: { lat: 23.7568, lng: 90.3918 },
  "Kawran Bazar": { lat: 23.7506, lng: 90.3915 },
  Mohakhali: { lat: 23.7804, lng: 90.4 },
  Panthapath: { lat: 23.7525, lng: 90.39 },
  Shantinagar: { lat: 23.7396, lng: 90.4149 },
  Malibagh: { lat: 23.7437, lng: 90.4277 },
  Rampura: { lat: 23.7639, lng: 90.4257 },
  Khilgaon: { lat: 23.7523, lng: 90.4445 },
  Banasree: { lat: 23.763, lng: 90.452 },
  "Elephant Road": { lat: 23.7389, lng: 90.385 },
  "New Market": { lat: 23.7385, lng: 90.3843 },
  Azimpur: { lat: 23.7296, lng: 90.3925 },
  "Green Road": { lat: 23.7462, lng: 90.3883 },
};

const jitterCoordinate = (value: number, magnitude = 0.01) => {
  return value + (Math.random() - 0.5) * magnitude;
};

export const generateGeoPointForLocation = (location: string) => {
  const base = locationCoordinateHints[location] ?? dhakaReference;
  return {
    latitude: Number(jitterCoordinate(base.lat, 0.02).toFixed(6)),
    longitude: Number(jitterCoordinate(base.lng, 0.02).toFixed(6)),
  };
};

export const generateAddressForLocation = (location: string) => {
  const { latitude, longitude } = generateGeoPointForLocation(location);
  return {
    address_line_1: faker.location.streetAddress(),
    address_line_2: faker.location.secondaryAddress(),
    city: location,
    state: "Dhaka",
    country: "Bangladesh",
    postal_code: faker.location.zipCode("####"),
    latitude,
    longitude,
  };
};

export const generateDeliveryWindow = (minFloor = 20, maxCeiling = 120) => {
  const min = Math.floor(
    minFloor + Math.random() * (maxCeiling - minFloor + 1)
  );
  const maxSpread = Math.min(
    Math.floor(10 + Math.random() * 26),
    maxCeiling - min
  );
  const max = min + maxSpread;
  return { min, max };
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
