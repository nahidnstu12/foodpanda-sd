// here need to user seed

import { assignUserRole, createUserProfile } from '@/actions/auth';
import { UserRole } from '@/helpers/user.enum';
import { auth } from '@/lib/auth';
import {
  adminUser,
  customerUser,
  partnerUser,
  riderUser,
  superadminUser,
} from './user';

export const seed = async () => {
  const adminSignUp = await auth.api.signUpEmail({
    body: {
      name: adminUser.name,
      email: adminUser.email,
      password: adminUser.password,
    },
  });
  const customerSignUp = await auth.api.signUpEmail({
    body: {
      name: customerUser.name,
      email: customerUser.email,
      password: customerUser.password,
    },
  });
  const riderSignUp = await auth.api.signUpEmail({
    body: {
      name: riderUser.name,
      email: riderUser.email,
      password: riderUser.password,
    },
  });
  const partnerSignUp = await auth.api.signUpEmail({
    body: {
      name: partnerUser.name,
      email: partnerUser.email,
      password: partnerUser.password,
    },
  });
  const superadminSignUp = await auth.api.signUpEmail({
    body: {
      name: superadminUser.name,
      email: superadminUser.email,
      password: superadminUser.password,
    },
  });

  // Assign role based on user_type
  await assignUserRole(adminSignUp.user.id, UserRole.ADMIN);
  await assignUserRole(customerSignUp.user.id, UserRole.CUSTOMER);
  await assignUserRole(riderSignUp.user.id, UserRole.RIDER);
  await assignUserRole(partnerSignUp.user.id, UserRole.PARTNER);
  await assignUserRole(superadminSignUp.user.id, UserRole.SUPER_ADMIN);

  // Create profile based on user_type
  await createUserProfile(adminSignUp.user.id, UserRole.ADMIN);
  await createUserProfile(customerSignUp.user.id, UserRole.CUSTOMER);
  await createUserProfile(riderSignUp.user.id, UserRole.RIDER);
  await createUserProfile(partnerSignUp.user.id, UserRole.PARTNER);
  await createUserProfile(superadminSignUp.user.id, UserRole.SUPER_ADMIN);
};

seed()
  .then(() => {
    console.log('Seed completed');
  })
  .catch((error) => {
    console.error('Error seeding:', error);
  });
