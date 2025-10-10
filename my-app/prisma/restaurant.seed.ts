// ============================================================================
// FILE: seed/restaurant.seed.ts
// ============================================================================

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma"; // Adjust to your prisma instance
import { assignUserRole, createUserProfile } from "@/actions/auth";
import { UserRole } from "@/helpers/user.enum";

import {
  addPriceVariation,
  generateRating,
  isAvailable,
  pickRandom,
  generateRestaurantName,
  generateCompanyName,
  generatePhoneNumber,
  generateLogoUrl,
  generateCoverImageUrl,
  locationSuffixes,
} from "./utils/faker.helper";
import { restaurantTemplates } from "./data/restaurants";
import { pastaTemplates, pizzaTemplates } from "./data/menu-item";
import { customizationPatterns } from "./data/customizations";
import { PartnerProfile } from "../generated/prisma";

// ============================================================================
// PHASE 1: Create Partner Users
// ============================================================================

async function createPartnerUsers(count: number) {
  console.log(`📝 Creating ${count} partner users...`);

  const partnerUsers = [];

  for (let i = 0; i < count; i++) {
    const email = `partner${i + 1}@restaurant.com`;
    const password = "Partner@123"; // Use env variable in production
    const name = `Partner ${i + 1}`;

    try {
      const signUp = await auth.api.signUpEmail({
        body: { name, email, password },
      });

      await assignUserRole(signUp.user.id, UserRole.PARTNER);
      await createUserProfile(signUp.user.id, UserRole.PARTNER);

      partnerUsers.push({
        id: signUp.user.id,
        email,
        name,
      });

      process.stdout.write(`\r  ✓ Created user ${i + 1}/${count}`);
    } catch (error) {
      console.error(`\n  ✗ Failed to create user ${i + 1}:`, error);
    }
  }

  console.log("\n✅ Partner users created\n");
  return partnerUsers;
}

// ============================================================================
// PHASE 2: Create Partner Profiles
// ============================================================================

async function createPartnerProfiles(
  partnerUsers: { id: string; email?: string; name?: string }[]
) {
  console.log("📝 Creating partner profiles...");

  const profiles: PartnerProfile[] = [];
  const errors: Array<{
    index: number;
    userId: string;
    email?: string;
    error: any;
  }> = [];

  for (let i = 0; i < partnerUsers.length; i++) {
    const user = partnerUsers[i];

    try {
      // Idempotency: skip if profile already exists (helps on re-runs)
      const existing = await prisma.partnerProfile.findUnique({
        where: { owner_user_id: user.id },
      });

      if (existing) {
        profiles.push(existing);
        process.stdout.write(
          `\r  • Skipped existing profile ${profiles.length}/${
            partnerUsers.length
          } (user: ${user.id}${user.email ? ", " + user.email : ""})`
        );
        continue;
      }

      const profile: PartnerProfile = await prisma.partnerProfile.create({
        data: {
          owner_user_id: user.id,
          company_name: generateCompanyName(
            `Restaurant Business ${profiles.length + 1}`
          ),
          contact_number: generatePhoneNumber(),
          restaurant_type: "Italian",
          operating_hours: {
            monday: { open: "10:00", close: "22:00" },
            tuesday: { open: "10:00", close: "22:00" },
            wednesday: { open: "10:00", close: "22:00" },
            thursday: { open: "10:00", close: "22:00" },
            friday: { open: "10:00", close: "23:00" },
            saturday: { open: "10:00", close: "23:00" },
            sunday: { open: "11:00", close: "21:00" },
          },
        },
      });

      profiles.push(profile);
      process.stdout.write(
        `\r  ✓ Created profile ${profiles.length}/${
          partnerUsers.length
        } (user: ${user.id}${user.email ? ", " + user.email : ""})`
      );
    } catch (error: any) {
      // Capture and log rich error info
      errors.push({ index: i, userId: user.id, email: user.email, error });

      // Specific handling for Prisma unique constraint
      if (error && error.code === "P2002") {
        console.error(
          `\n  ✗ Unique constraint violation for user ${user.id}${
            user.email ? " (" + user.email + ")" : ""
          } on target ${JSON.stringify(error?.meta?.target)}`
        );

        // Show the existing record if present to debug duplicates
        try {
          const dup = await prisma.partnerProfile.findUnique({
            where: { owner_user_id: user.id },
          });
          if (dup) {
            console.error(
              `    Existing profile id=${dup.id} owner_user_id=${dup.owner_user_id}`
            );
          }
        } catch {}
      } else {
        console.error(
          `\n  ✗ Failed to create profile for user ${user.id}${
            user.email ? " (" + user.email + ")" : ""
          }:`,
          error
        );
      }
    }
  }

  console.log("\n✅ Partner profiles processed\n");

  if (errors.length > 0) {
    console.warn("⚠️ Profile creation errors summary:");
    for (const e of errors) {
      console.warn(
        `  - index=${e.index} user=${e.userId}${
          e.email ? " (" + e.email + ")" : ""
        } code=${e?.error?.code ?? "unknown"}`
      );
    }
  }

  return profiles;
}

// ============================================================================
// PHASE 3: Create Restaurants
// ============================================================================

async function createRestaurants(profiles: { id: string }[]) {
  console.log("📝 Creating restaurants...");

  const restaurants = [];

  for (let i = 0; i < profiles.length; i++) {
    const template = pickRandom(restaurantTemplates);
    const location = pickRandom(locationSuffixes);
    const name = generateRestaurantName(template.namePattern, location);

    const restaurant = await prisma.restaurant.create({
      data: {
        partner_profile_id: profiles[i].id,
        name,
        description: template.description,
        logo_url: generateLogoUrl(name),
        cover_image_url: generateCoverImageUrl(template.cuisine),
        cuisine: template.cuisine,
        rating: generateRating(),
        is_active: true,
      },
    });

    restaurants.push({ ...restaurant, type: template.type });
    process.stdout.write(
      `\r  ✓ Created restaurant ${i + 1}/${profiles.length}`
    );
  }

  console.log("\n✅ Restaurants created\n");
  return restaurants;
}

// ============================================================================
// PHASE 4: Create Menus
// ============================================================================

async function createMenus(restaurants: { id: string }[]) {
  console.log("📝 Creating menus...");

  const menusData = restaurants.map((restaurant) => ({
    restaurant_id: restaurant.id,
    name: "Main Menu",
    description: "Our full menu with pizzas, pastas, and more",
    is_active: true,
  }));

  await prisma.menu.createMany({ data: menusData });

  // Fetch created menus with restaurant relationship
  const menus = await prisma.menu.findMany({
    where: {
      restaurant_id: { in: restaurants.map((r) => r.id) },
    },
    include: {
      restaurant: true,
    },
  });

  console.log(`✅ Created ${menus.length} menus\n`);
  return menus;
}

// ============================================================================
// PHASE 5: Create Categories
// ============================================================================

async function createCategories(menus: any[]) {
  console.log("📝 Creating categories...");

  const categoriesData = [];

  for (const menu of menus) {
    // Every restaurant gets Pizza and Pasta categories
    categoriesData.push(
      {
        menu_id: menu.id,
        name: "Classic Pizzas",
        description: "Traditional and specialty pizzas",
      },
      {
        menu_id: menu.id,
        name: "Gourmet Pastas",
        description: "Fresh pasta dishes made to order",
      }
    );
  }

  await prisma.category.createMany({ data: categoriesData });

  const categories = await prisma.category.findMany({
    where: {
      menu_id: { in: menus.map((m) => m.id) },
    },
    include: {
      menu: {
        include: {
          restaurant: true,
        },
      },
    },
  });

  console.log(`✅ Created ${categories.length} categories\n`);
  return categories;
}

// ============================================================================
// PHASE 6: Create Menu Items
// ============================================================================

async function createMenuItems(categories: any[]) {
  console.log("📝 Creating menu items...");

  const menuItemsData = [];

  for (const category of categories) {
    const isPizzaCategory = category.name.toLowerCase().includes("pizza");
    const templates = isPizzaCategory ? pizzaTemplates : pastaTemplates;
    const itemType = isPizzaCategory ? "pizza" : "pasta";

    // Create 10-12 items per category
    const itemCount = 10 + Math.floor(Math.random() * 3);
    const selectedTemplates = templates.slice(0, itemCount);

    for (const template of selectedTemplates) {
      menuItemsData.push({
        category_id: category.id,
        restaurant_id: category.menu.restaurant_id, // Denormalized
        name: template.name,
        description: template.description,
        price: addPriceVariation(template.basePrice),
        image_url: `https://source.unsplash.com/400x300/?${template.name.replace(
          /\s/g,
          "-"
        )},food`,
        search_tags: template.tags,
        is_available: isAvailable(0.9),
      });
    }
  }

  // Batch create all menu items
  await prisma.menuItem.createMany({ data: menuItemsData });

  const menuItems = await prisma.menuItem.findMany({
    include: {
      category: {
        include: {
          menu: {
            include: {
              restaurant: true,
            },
          },
        },
      },
    },
  });

  console.log(`✅ Created ${menuItems.length} menu items\n`);
  return menuItems;
}

// ============================================================================
// PHASE 7: Create Customizations & Choices
// ============================================================================

async function createCustomizationsAndChoices(menuItems: any[]) {
  console.log("📝 Creating customizations and choices...");

  let customizationCount = 0;
  let choiceCount = 0;

  // Process in batches to avoid overwhelming the database
  const BATCH_SIZE = 50;

  // Strongly-typed customization keys for safer indexing
  const pizzaTypes = ["size", "crust", "toppings", "cheese"] as const;
  const pastaTypes = ["portion", "spiceLevel", "addOns"] as const;

  type CustomizationPattern = {
    name: string;
    isRequired: boolean;
    minSelection: number;
    maxSelection: number;
    choices: Array<{ name: string; priceChange: number }>;
  };

  for (let i = 0; i < menuItems.length; i += BATCH_SIZE) {
    const batch = menuItems.slice(i, i + BATCH_SIZE);

    await prisma.$transaction(
      batch.map((item) => {
        const isPizza = item.category.name.toLowerCase().includes("pizza");
        const itemType = isPizza ? "pizza" : "pasta";
        const patterns = customizationPatterns[itemType];

        // Determine which customization types this item should have
        const customizationTypes = isPizza ? pizzaTypes : pastaTypes;

        // Create customizations with nested choices
        return prisma.menuItem.update({
          where: { id: item.id },
          data: {
            customizations: {
              create: customizationTypes.map((type) => {
                const pattern = (
                  patterns as unknown as Record<string, CustomizationPattern>
                )[type as unknown as string];
                customizationCount++;

                return {
                  name: pattern.name,
                  is_required: pattern.isRequired,
                  min_selection: pattern.minSelection,
                  max_selection: pattern.maxSelection,
                  choices: {
                    create: pattern.choices.map((choice: any) => {
                      choiceCount++;
                      return {
                        name: choice.name,
                        price_change: choice.priceChange,
                        is_available: isAvailable(0.95), // 95% available
                      };
                    }),
                  },
                };
              }),
            },
          },
        });
      })
    );

    process.stdout.write(
      `\r  ✓ Processed ${Math.min(i + BATCH_SIZE, menuItems.length)}/${
        menuItems.length
      } items`
    );
  }

  console.log(
    `\n✅ Created ${customizationCount} customizations and ${choiceCount} choices\n`
  );
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

export async function seedRestaurantSystem() {
  console.log("\n🌱 Starting Restaurant System Seeding...\n");
  console.log("=".repeat(50));

  try {
    // PHASE 1: Create 20 partner users
    const partnerUsers = await createPartnerUsers(20);

    // PHASE 2: Create partner profiles
    const partnerProfiles = await createPartnerProfiles(partnerUsers);

    // PHASE 3: Create restaurants
    const restaurants = await createRestaurants(partnerProfiles);

    // PHASE 4: Create menus
    const menus = await createMenus(restaurants);

    // PHASE 5: Create categories
    const categories = await createCategories(menus);

    // PHASE 6: Create menu items
    const menuItems = await createMenuItems(categories);

    // PHASE 7: Create customizations and choices
    await createCustomizationsAndChoices(menuItems);

    console.log("=".repeat(50));
    console.log("\n✅ Restaurant System Seeding Completed!\n");
    console.log("📊 Summary:");
    console.log(`   • Partner Users: ${partnerUsers.length}`);
    console.log(`   • Restaurants: ${restaurants.length}`);
    console.log(`   • Menus: ${menus.length}`);
    console.log(`   • Categories: ${categories.length}`);
    console.log(`   • Menu Items: ${menuItems.length}`);
    console.log(`   • Estimated Customizations: ${menuItems.length * 3}`);
    console.log(`   • Estimated Choices: ${menuItems.length * 15}\n`);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    throw error;
  }
}

// ============================================================================
// Run the seed
// ============================================================================

seedRestaurantSystem()
  .then(() => {
    console.log("🎉 Seed process completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seed process failed:", error);
    process.exit(1);
  });
