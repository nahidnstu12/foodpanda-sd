import { faker } from "@faker-js/faker";
import { db } from "../prisma.mjs";
import { UserType, UserStatus } from "../../generated/prisma/index.js";
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
const START_DATE = new Date("2024-11-01T00:00:00Z");
const END_DATE = new Date("2025-03-31T23:59:59Z");

function randomDateBetween(start, end) {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	);
}

export async function seedUsersWithProfiles(count = 100) {
	const users = [];

	console.log(`Seeding ${count} users...`);

	const AdminCount = 1;
	const RiderCount = 25;
	const PartnerCount = 10;
	const CustomerCount = count - AdminCount - RiderCount - PartnerCount;

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
			// user_type: userType,
			status: faker.helpers.arrayElement(ACCOUNT_STATUSES),
			created_at: createdAt.toISOString(),
			updated_at: updatedAt.toISOString(),
			// average_rating: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
			is_email_verified: faker.datatype.boolean(),
			is_phone_verified: faker.datatype.boolean(),
			deleted_at: null,
		};

		users.push(user);
	}

	// Create Admin Profile
	const adminProfile = {
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		dob: faker.date.dob(),
		gender: faker.gender(),
		photo_url: faker.image.urlPicsumPhotos()
	}

	//   Create Rider Profile
	const riderProfile = []
	for (let i = 0; i < RiderCount; i++) {
		riderProfile.push({
			first_name: faker.person.firstName(),
			last_name: faker.person.lastName(),
			dob: faker.date.dob(),
			gender: faker.gender(),
			photo_url: faker.image.urlPicsumPhotos(),
			licence_numer: faker.licence_numer(),
			vehicle_registration_number: faker.vehicle.vrm(),
			rating: faker.number.float({ multipleOf: 0.25, min: 0, max:5 })
		})
	}

	// create Partner Profile
	const partnerProfile = []
	for (let i = 0; i < PartnerCount; i++) {
		partnerProfile.push({
			first_name: faker.person.firstName(),
			last_name: faker.person.lastName(),
			dob: faker.date.dob(),
			gender: faker.gender(),
			photo_url: faker.image.urlPicsumPhotos(),
			restaurant_type: faker.food.ethnicCategory(),
			contact_number: faker.phone.number({ style: 'international' })
		})
	}

	// create customer profile
	const customerProfile = []
	for (let i = 0; i < CustomerCount; i++) {
		customerProfile.push({
			first_name: faker.person.firstName(),
			last_name: faker.person.lastName(),
			dob: faker.date.dob(),
			gender: faker.gender(),
			photo_url: faker.image.urlPicsumPhotos()
		})
	}

	if (users.length === 0) {
		console.log("No users to insert.");
		return;
	}

	try {
		await db.user.createMany({
			data: users,
		});
		console.log("✅ Successfully seeded users with profiles and skills!");
	} catch (error) {
		console.error("❌ Error seeding users:", error);
		throw error;
	}
}
