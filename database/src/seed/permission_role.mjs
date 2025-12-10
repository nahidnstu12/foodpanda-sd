// import { permissionsData, rolesData } from "../data/permission2.mjs";
// import { db } from "../prisma.mjs";

// export async function seedRolesAndPermissions() {
//     console.log('Seeding permissions and roles...');
  
//     try {
//       // Step 1: Seed Permissions
//       await db.permission.createMany({
//         data: permissionsData,
//         skipDuplicates: true, // Skip if keys already exist (unique constraint)
//       });
//       console.log('✅ Permissions seeded successfully!');
  
//       // Step 2: Seed Roles with Permissions
//       for (const role of rolesData) {
//         await db.role.upsert({
//           where: { key: role.key },
//           update: {
//             name: role.name,
//             description: role.description,
//             role_permissions: {
//               connect: role.permissions.map((key) => ({ key })),
//             },
//           },
//           create: {
//             name: role.name,
//             key: role.key,
//             description: role.description,
//             role_permissions: {
//               connect: role.permissions.map((key) => ({ key })),
//             },
//           },
//         });
//       }
//       console.log('✅ Roles seeded with permissions successfully!');
//     } catch (error) {
//       console.error('❌ Error seeding roles and permissions:', error);
//       throw error;
//     }
//   }


import { permissionsData, rolesData } from "../data/permission2.mjs";
import { db } from "../prisma.mjs";

const STRICT_DELETE_OBSOLETE_PERMISSIONS = false; // true = hard delete, false = just warn

export async function seedRolesAndPermissions() {
  console.log("Seeding permissions and roles (idempotent sync)...");

  await db.$transaction(async (tx) => {
    // 1) Upsert all permissions by key
    for (const p of permissionsData) {
      await tx.permission.upsert({
        where: { key: p.key },
        update: {
          name: p.name,
          description: p.description,
          group: p.group,
        },
        create: {
          key: p.key,
          name: p.name,
          description: p.description,
          group: p.group,
        },
      });
    }

    // 2) Optionally detect/remove/deprecate obsolete permissions
    const desiredKeys = new Set(permissionsData.map((p) => p.key));
    const existing = await tx.permission.findMany({ select: { id: true, key: true } });
    const obsolete = existing.filter((e) => !desiredKeys.has(e.key));

    if (obsolete.length > 0) {
      if (STRICT_DELETE_OBSOLETE_PERMISSIONS) {
        // Disconnect from roles then delete
        const obsoleteKeys = obsolete.map((o) => o.key);
        const roles = await tx.role.findMany({
          select: { id: true, key: true, role_permissions: { select: { key: true } } },
        });
        for (const r of roles) {
          const keep = r.role_permissions
            .filter((perm) => !obsoleteKeys.includes(perm.key))
            .map((perm) => ({ key: perm.key }));
          await tx.role.update({
            where: { id: r.id },
            data: { role_permissions: { set: keep } },
          });
        }
        await tx.permission.deleteMany({ where: { key: { in: obsoleteKeys } } });
        console.warn(`Removed obsolete permissions: ${obsoleteKeys.join(", ")}`);
      } else {
        // Soft approach: just warn now; add a "deprecated" column later if you want
        console.warn(
          `Obsolete permissions detected (not deleted): ${obsolete.map((o) => o.key).join(", ")}`
        );
      }
    }

    // 3) Upsert roles and sync their permissions exactly
    for (const role of rolesData) {
      const roleRecord = await tx.role.upsert({
        where: { key: role.key },
        update: {
          name: role.name,
          description: role.description,
        },
        create: {
          key: role.key,
          name: role.name,
          description: role.description,
        },
      });

      // Ensure all referenced permissions exist (defensive)
      const rolePermissionKeys = Array.from(new Set(role.permissions));

      const existingRolePerms = await tx.permission.findMany({
        where: { key: { in: rolePermissionKeys } },
        select: { key: true },
      });
      const existingRolePermSet = new Set(existingRolePerms.map((p) => p.key));
      const missing = rolePermissionKeys.filter((k) => !existingRolePermSet.has(k));
      if (missing.length > 0) {
        throw new Error(
          `Role ${role.key} references unknown permissions: ${missing.join(", ")}`
        );
      }

      // Replace permissions (avoid drift): use set, not connect-only
      await tx.role.update({
        where: { id: roleRecord.id },
        data: {
          role_permissions: {
            set: rolePermissionKeys.map((k) => ({ key: k })),
          },
        },
      });
    }
  }, { timeout: 10000 });

  console.log("✅ Permissions and roles synced successfully!");
}