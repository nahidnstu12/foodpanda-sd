"use client";

import { MenuItemCard } from "./menu-item-card";

interface MenuSectionProps {
  category: any;
}

export function MenuSection({ category }: MenuSectionProps) {
  return (
    <section id={`category-${category.id}`} className="scroll-mt-40">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-2">
          {category.name}
        </h2>
        {category.description && (
          <p className="text-[#9CA3AF]">{category.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {(category.menu_items || []).map((item: any) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
