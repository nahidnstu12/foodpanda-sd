import { HeroSection } from '@/components/frontend/home/hero-section';
import { PopularMenuItems } from '@/components/frontend/home/popular-menuitem';
import { PopularRestaurants } from '@/components/frontend/home/popular-restaurants';

export default function Home() {
  return (
    <>
      <HeroSection />
      <PopularRestaurants />
      <PopularMenuItems />
    </>
  );
}
// http://localhost:3010/menu-item/item-5
