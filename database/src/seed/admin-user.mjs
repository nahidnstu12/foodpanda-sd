import { faker } from "@faker-js/faker";
import { db } from "../prisma.mjs";
// TODO: FIX LATER

// Pre-hashed bcrypt password (same as used in user seeder)
// Change if you need a different default; this lets us avoid a bcrypt dependency
const DEFAULT_HASHED_PASSWORD ="password";

export async function seedAdminUsers() {
    console.log("Seeding Super Admin and Admin users...");

    // Ensure required roles exist
    const [superAdminRole, adminRole] = await Promise.all([
        db.role.findUnique({ where: { key: "SUPER_ADMIN" } }),
        db.role.findUnique({ where: { key: "ADMIN" } }),
    ]);

    if (!superAdminRole || !adminRole) {
        throw new Error(
            "Required roles not found. Seed roles and permissions before admin users."
        );
    }

    const now = new Date();

    const users = [
        {
            // Super Admin
            email: "superadmin@example.com",
            username: "Super Admin",
            password: DEFAULT_HASHED_PASSWORD,
            roleId: superAdminRole.id,
        },
        {
            // Admin
            email: "admin@example.com",
            username: "Admin User",
            password: DEFAULT_HASHED_PASSWORD,
            roleId: adminRole.id,
        },
    ];

    for (const u of users) {
        // If user already exists, skip creating again
        const existing = await db.user.findUnique({ where: { email: u.email } });
        if (existing) {
            console.log(`User already exists: ${u.email} -> skipping.`);
            continue;
        }

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        await db.user.create({
            data: {
                email: u.email,
                username: u.username,
                password: u.password,
                status: UserStatus.ACTIVE,
                is_email_verified: true,
                is_phone_verified: false,
                created_at: now,
                // Admin profile required fields per schema
                admin_profile: {
                    create: {
                        first_name: firstName,
                        last_name: lastName,
                        dob: new Date("1990-01-01T00:00:00Z").toISOString(),
                        gender: "other",
                        photo_url: null,
                    },
                },
                user_roles: {
                    connect: [{ id: u.roleId }],
                },
            },
        });

        console.log(`Created user: ${u.email}`);
    }

    console.log("✅ Super Admin and Admin users seeded");
}


