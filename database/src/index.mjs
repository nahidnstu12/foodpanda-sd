import { seedUsersWithProfiles } from "./seed/user.mjs";
import { db } from "./prisma.mjs";


(async function main() {
	// truncate all tables
	await db.$transaction(async (tx) => {
		console.log("Truncating all tables (User)");
		await tx.user.deleteMany();
		console.log("Tables truncated successfully");
	});

	// Seed skills
	// await seedSkills();
	await seedUsersWithProfiles(5);


})();