import { faker } from '@faker-js/faker';
import { UserStatus } from '../../generated/prisma/index.js';
import { db } from '../prisma.mjs';
/**
 * 

 */
const ACCOUNT_STATUSES = Object.values(UserStatus);
const START_DATE = new Date('2024-11-01T00:00:00Z');
const END_DATE = new Date('2025-03-31T23:59:59Z');

function randomDateBetween(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function generateUniqueUserData(existingEmails, existingPhones) {
  let email;
  let phone;

  // Generate unique email
  do {
    email = faker.internet.email();
  } while (existingEmails.has(email));
  existingEmails.add(email);

  // Generate unique phone (nullable)
  if (faker.datatype.boolean()) {
    do {
      phone = faker.phone.number();
    } while (existingPhones.has(phone));
    existingPhones.add(phone);
  } else {
    phone = null;
  }

  // Generate timestamps
  const createdAt = randomDateBetween(START_DATE, END_DATE);
  const updatedAt = randomDateBetween(createdAt, END_DATE);

  return {
    email,
    phone,
    username: faker.person.fullName(),
    password: '$2a$10$Bb9ymnS87EfBLC3GXf9/Huk5/og4u8lVOaVUYk7QiSjyNW58S5W62',
    status: faker.helpers.arrayElement(ACCOUNT_STATUSES),
    created_at: createdAt,
    updated_at: updatedAt,
    is_email_verified: faker.datatype.boolean(),
    is_phone_verified: phone ? faker.datatype.boolean() : false,
    deleted_at: null,
  };
}

export async function seedUsersWithProfiles(count = 100) {
  const existingEmails = new Set();
  const existingPhones = new Set();

  const superadminRole = await db.role.findUnique({where: {key: "SUPER_ADMIN"}})
  const adminRole = await db.role.findUnique({where: {key: "ADMIN"}})
  const riderRole = await db.role.findUnique({where: {key: "RIDER"}})
  const partnerRole = await db.role.findUnique({where: {key: "PARTNER"}})
  const customerRole = await db.role.findUnique({where: {key: "CUSTOMER"}})

  

  console.log(`Seeding ${count} users...`);

  const AdminCount = 5;
  const SuperAdminCount = 1;
  const RiderCount = 25;
  const PartnerCount = 10;
  const CustomerCount = count - SuperAdminCount - AdminCount - RiderCount - PartnerCount;

  try {
    // Generate Admin (using CustomerProfile for simplicity)
    const adminData = await generateUniqueUserData(
      existingEmails,
      existingPhones
    );
    await db.$transaction([
      db.user.create({
        data: {
          ...adminData,
          status: UserStatus.ACTIVE, // Admins are typically active
          customer_profile: {
            create: {
              first_name: faker.person.firstName(),
              last_name: faker.person.lastName(),
              dob: faker.date.birthdate().toISOString(),
              gender: faker.person.gender(),
              photo_url: faker.image.urlPicsumPhotos(),
            },
          },
		  user_roles: {
			connect: [{id: superadminRole.id}]
		  }
        },
      }),
    ]);

	    //     // create admin profile
		for (let i = 0; i < AdminCount; i++) {
			const userData = await generateUniqueUserData(
			  existingEmails,
			  existingPhones
			);
			await db.user.create({
			  data: {
				...userData,
				admin_profile: {
				  create: {
					  first_name: faker.person.firstName(),
					  last_name: faker.person.lastName(),
					  dob: faker.date.birthdate().toISOString(),
					  gender: faker.person.gender(),
					  photo_url: faker.image.urlPicsumPhotos(),
				  },
				},
				user_roles: {
					connect: [{id: adminRole.id}]
				  }
			  },
			});
		  }

    //     // create rider profile
    for (let i = 0; i < RiderCount; i++) {
      const userData = await generateUniqueUserData(
        existingEmails,
        existingPhones
      );
      await db.user.create({
        data: {
          ...userData,
          rider_profile: {
            create: {
              first_name: faker.person.firstName(),
              last_name: faker.person.lastName(),
              dob: faker.date.birthdate().toISOString(),
              gender: faker.person.gender(),
              photo_url: faker.image.urlPicsumPhotos(),
              license_number: faker.vehicle.vin(),
              vehicle_registration_number: faker.vehicle.vrm(),
              rating: faker.number.float({ multipleOf: 0.25, min: 0, max: 5 }),
            },
          },
		  user_roles: {
			connect: [{id: riderRole.id}]
		  }
        },
      });
    }

    //     // create partner profile
    for (let i = 0; i < PartnerCount; i++) {
      const userData = await generateUniqueUserData(
        existingEmails,
        existingPhones
      );
      await db.user.create({
        data: {
          ...userData,
          partner_profile: {
            create: {
              company_name: faker.company.name(),
              restaurant_type: faker.food.ethnicCategory(),
              contact_number: faker.phone.number({ style: 'international' }),
            },
          },
		  user_roles: {
			connect: [{id: partnerRole.id}]
		  }
        },
      });
    }
    //     // create customer profile
    for (let i = 0; i < CustomerCount; i++) {
      const userData = await generateUniqueUserData(
        existingEmails,
        existingPhones
      );
      await db.user.create({
        data: {
          ...userData,
          customer_profile: {
            create: {
              first_name: faker.person.firstName(),
              last_name: faker.person.lastName(),
              dob: faker.date.birthdate().toISOString(),
              gender: faker.person.gender(),
              photo_url: faker.image.urlPicsumPhotos(),
            },
          },
		  user_roles: {
			connect: [{id: customerRole.id}]
		  }
        },
      });
    }

    console.log('✅ Successfully seeded users with profiles!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}
