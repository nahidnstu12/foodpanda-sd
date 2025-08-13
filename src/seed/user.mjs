import { faker } from '@faker-js/faker';
import { db } from '../prisma.mjs';
import { UserType, UserStatus } from '../../generated/prisma/index.js';
/**
 * 
USER (
id PK,
username,
email UNIQUE,
phone UNIQUE,
password_hash,
status, -- e.g., 'active', 'suspended', 'pending_verification'
is_email_verified,
is_phone_verified,
created_at,
updated_at,
deleted_at
)
 */
const ACCOUNT_STATUSES = Object.values(UserStatus);
const USER_TYPES = Object.values(UserType);
const START_DATE = new Date('2024-11-01T00:00:00Z');
const END_DATE = new Date('2025-03-31T23:59:59Z');

function randomDateBetween(start, end) {	
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
}

export async function seedUsersWithProfiles(count = 100) {
	const users = [];
	// const freelancerProfiles = [];
	// const clientProfiles = [];

	// // Calculate distribution: 75% freelancers, 25% clients
	// const numClients = Math.floor(count * 0.25);
	// const numFreelancers = count - numClients;

	// console.log(
	// 	`Seeding ${numFreelancers} freelancers and ${numClients} clients...`
	// );

	console.log(`Seeding ${count} users...`);

	// Generate users with profiles
	for (let i = 0; i < count; i++) {
		const createdAt = randomDateBetween(START_DATE, END_DATE);
		const updatedAt = randomDateBetween(createdAt, END_DATE);
		const userType = faker.helpers.arrayElement(USER_TYPES);

		const user = {
			email: faker.internet.email(),
			phone: faker.phone.number(),
			username: faker.person.fullName(),
			password: "password123",
			user_type: userType,
			status: faker.helpers.arrayElement(ACCOUNT_STATUSES),
			created_at: createdAt.toISOString(),
			updated_at: updatedAt.toISOString(),
			// average_rating: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
			is_email_verified: faker.datatype.boolean(),
			is_phone_verified: faker.datatype.boolean(),
			deleted_at: null,
		};

		users.push(user);

		// Create corresponding profile based on user type
		// if (userType === 'freelancer') {
		// 	// Select random skills for this freelancer
		// 	const selectedSkills = faker.helpers.arrayElements(ALL_SKILLS, {
		// 		min: 2,
		// 		max: 8,
		// 	});

		// 	freelancerProfiles.push({
		// 		name: faker.person.fullName(),
		// 		location: faker.location.city(),
		// 		hourly_rate: faker.helpers.rangeToNumber({ min: 10, max: 200 }),
		// 		is_available: faker.datatype.boolean(),
		// 		portfolio: {
		// 			projects: faker.helpers.rangeToNumber({ min: 0, max: 20 }),
		// 			experience_years: faker.helpers.rangeToNumber({ min: 1, max: 15 }),
		// 			completed_projects: faker.helpers.rangeToNumber({ min: 0, max: 50 }),
		// 		},
		// 		skills: selectedSkills, // Array of skill names for JSONB
		// 		skillIds: [], // Will be populated with actual skill IDs
		// 	});
		// } else {
		// 	clientProfiles.push({
		// 		company_name: faker.company.name(),
		// 		description: faker.company.catchPhrase(),
		// 		location: faker.location.city(),
		// 		contact_info: {
		// 			phone: faker.phone.number(),
		// 			website: faker.internet.url(),
		// 			linkedin: faker.internet.url(),
		// 		},
		// 	});
		// }
	}

	if (users.length === 0) {
		console.log('No users to insert.');
		return;
	}

	try {
		await db.user.createMany({
			data: users,
		});
		console.log('✅ Successfully seeded users with profiles and skills!');
	} catch (error) {
		console.error('❌ Error seeding users:', error);
		throw error;
	}
}