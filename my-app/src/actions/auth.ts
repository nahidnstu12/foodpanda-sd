"use server";

import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import db from "@/lib/prisma";

interface SignUpData {
  name: string;
  email: string;
  password: string;
  user_type: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export async function signUpAction(formData: FormData): Promise<ActionResult> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const user_type = formData.get("user_type") as string;

    // Validate required fields
    if (!name || !email || !password || !user_type) {
      return {
        success: false,
        error: "All fields are required",
      };
    }

    // Validate user_type
    const validUserTypes = ["customer", "rider", "partner", "admin"];
    if (!validUserTypes.includes(user_type.toLowerCase())) {
      return {
        success: false,
        error: "Invalid user type selected",
      };
    }

    // Validate password length
    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    // Create user with Better Auth
    const signUpResult = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    if (!signUpResult || !signUpResult.user) {
      return {
        success: false,
        error: "Failed to create user account",
      };
    }

    const userId = signUpResult.user.id;

    // Assign role based on user_type
    await assignUserRole(userId, user_type);

    // Create profile based on user_type
    await createUserProfile(userId, user_type);

    // Send welcome email (don't wait for it)
    // sendWelcomeEmail({
    //   to: email,
    //   name,
    //   userType: user_type,
    // }).catch((error) => {
    //   console.error('Failed to send welcome email:', error);
    // });

    // Revalidate any cached data
    revalidatePath("/");

    return {
      success: true,
      data: {
        user: {
          id: userId,
          name,
          email,
          user_type,
        },
      },
    };
  } catch (error) {
    console.error("Signup action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

// Helper function to assign user role
async function assignUserRole(userId: string, userType: string) {
  try {
    // Map user_type to role key
    const roleKeyMap: Record<string, string> = {
      customer: "customer",
      rider: "rider",
      partner: "partner",
      admin: "admin",
    };

    const roleKey = roleKeyMap[userType.toLowerCase()];
    if (!roleKey) {
      console.warn(`Unknown user_type: ${userType}`);
      return;
    }

    // Find the role
    const role = await db.role.findUnique({
      where: { key: roleKey },
    });

    if (!role) {
      console.error(`Role not found for key: ${roleKey}`);
      // Create the role if it doesn't exist
      const newRole = await db.role.create({
        data: {
          name: roleKey.charAt(0).toUpperCase() + roleKey.slice(1),
          key: roleKey,
          description: `${roleKey} role`,
        },
      });

      await db.user.update({
        where: { id: userId },
        data: {
          user_roles: {
            connect: { id: newRole.id },
          },
        },
      });
      return;
    }

    // Assign role to user
    await db.user.update({
      where: { id: userId },
      data: {
        user_roles: {
          connect: { id: role.id },
        },
      },
    });

    console.log(`Assigned role ${roleKey} to user ${userId}`);
  } catch (error) {
    console.error("Error assigning user role:", error);
    throw error; // Re-throw to handle in main function
  }
}

// Helper function to create user profile
async function createUserProfile(userId: string, userType: string) {
  try {
    const profileData = {
      user_id: userId,
      first_name: "",
      last_name: "",
      dob: null,
      gender: null,
      photo_url: null,
    };

    console.log("createUserProfile>>", userType);

    switch (userType.toLowerCase()) {
      case "customer":
        await db.customerProfile.create({
          data: profileData,
        });
        console.log(`Created customer profile for user ${userId}`);
        break;

      case "rider":
        await db.riderProfile.create({
          data: {
            ...profileData,
            license_number: null,
            vehicle_registration_number: null,
            rating: 0.0,
          },
        });
        console.log(`Created rider profile for user ${userId}`);
        break;

      case "partner":
        await db.partnerProfile.create({
          data: {
            owner_user_id: userId,
            company_name: "",
            tax_id: null,
            restaurant_type: null,
            contact_number: null,
          },
        });
        console.log(`Created partner profile for user ${userId}`);
        break;

      case "admin":
        await db.adminProfile.create({
          data: profileData,
        });
        console.log(`Created admin profile for user ${userId}`);
        break;

      default:
        console.warn(`Unknown user_type for profile creation: ${userType}`);
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error; // Re-throw to handle in main function
  }
}

// Alternative action that redirects on success
export async function signUpWithRedirectAction(formData: FormData) {
  const result = await signUpAction(formData);

  if (result.success) {
    redirect("/sign-in?message=Account created successfully");
  }

  return result;
}
