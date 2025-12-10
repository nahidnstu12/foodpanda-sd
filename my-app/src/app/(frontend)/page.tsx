import { HeroSection } from "@/components/frontend/home/hero-section";
import { PopularMenuItems } from "@/components/frontend/home/popular-menuitem";
import { PopularRestaurants } from "@/components/frontend/home/popular-restaurants";
import { listPopularRestaurants } from "@/actions/restaurant";

export default async function Home() {
  const popularRestaurants = await listPopularRestaurants({ limit: 12 });

  return (
    <>
      <HeroSection />
      <PopularRestaurants restaurants={popularRestaurants} />
      <PopularMenuItems />
    </>
  );
}
// http://localhost:3010/menu-item/item-5
