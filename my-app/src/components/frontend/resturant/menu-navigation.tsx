'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuNavigationProps {
  categories: any[];
}

export function MenuNavigation({ categories }: MenuNavigationProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map((cat) => ({
        id: cat.id,
        element: document.getElementById(`category-${cat.id}`),
      }));

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveCategory(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const offset = 180;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="sticky top-20 z-40 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div
          ref={navRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide py-4"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'ghost'}
              className={cn(
                'shrink-0',
                activeCategory === category.id
                  ? 'bg-[#06C167] hover:bg-[#05a855] text-white'
                  : 'hover:bg-[#06C167]/10'
              )}
              onClick={() => scrollToCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
