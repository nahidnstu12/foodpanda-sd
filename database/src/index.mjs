import { seedUsersWithProfiles } from "./seed/user.mjs";
import { db } from "./prisma.mjs";
import { seedRolesAndPermissions } from "./seed/permission_role.mjs";
import { seedAdminUsers } from "./seed/admin-user.mjs";


(async function main() {
	// truncate all tables
	await db.$transaction(async (tx) => {
		// console.log("Truncating all tables (User)");

		// permission & roles related data
		await tx.permission.deleteMany();
		await tx.role.deleteMany();

		// user related data
		await tx.adminProfile.deleteMany();
		await tx.customerProfile.deleteMany();
		await tx.riderProfile.deleteMany();
		await tx.partnerProfile.deleteMany();
		await tx.user.deleteMany();

		// console.log("Tables truncated successfully");
	});

	// Seed skills
	await seedRolesAndPermissions()
	// await seedAdminUsers()
	// await seedUsersWithProfiles(100);



})();