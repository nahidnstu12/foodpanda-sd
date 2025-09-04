import { permissionsData, rolesData } from "../data/permission2.mjs";
import { db } from "../prisma.mjs";

export async function seedRolesAndPermissions() {
    console.log('Seeding permissions and roles...');
  
    try {
      // Step 1: Seed Permissions
      await db.permission.createMany({
        data: permissionsData,
        skipDuplicates: true, // Skip if keys already exist (unique constraint)
      });
      console.log('✅ Permissions seeded successfully!');
  
      // Step 2: Seed Roles with Permissions
      for (const role of rolesData) {
        await db.role.upsert({
          where: { key: role.key },
          update: {
            name: role.name,
            description: role.description,
            role_permissions: {
              connect: role.permissions.map((key) => ({ key })),
            },
          },
          create: {
            name: role.name,
            key: role.key,
            description: role.description,
            role_permissions: {
              connect: role.permissions.map((key) => ({ key })),
            },
          },
        });
      }
      console.log('✅ Roles seeded with permissions successfully!');
    } catch (error) {
      console.error('❌ Error seeding roles and permissions:', error);
      throw error;
    }
  }