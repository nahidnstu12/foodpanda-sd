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
export type LoginState = {
  success: boolean;
  message: string;
};

export async function signUpAction(data: any): Promise<ActionResult> {
  try {
    const name = data.name;
    const email = data.email;
    const password = data.password;
    const user_type = data.user_type || "CUSTOMER";

    // Validate required fields
    if (!name || !email || !password || !user_type) {
      console.log("All fields are required");
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

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string | null)?.trim();
  const password = formData.get("password") as string | null;

  console.log("loginAction>>", email, password);

  // --- Better Validation ---
  if (!email || !password) {
    return { success: false, message: "Email and password are required." };
  }
  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters.",
    };
  }

  try {
    const result = await auth.api.signInEmail({
      body: { email, password },
    });

    if (!result?.user) {
      // Handle cases where the API returns a 200 OK but no user (unlikely but safe)
      return { success: false, message: "Invalid email or password." };
    }
  } catch (e: any) {
    // Handle actual API errors (e.g., 401 Unauthorized)
    // Important: Don't re-throw redirect errors!
    if (e.message === "NEXT_REDIRECT") {
      throw e;
    }
    // You can inspect the error from your auth library to give more specific messages
    console.error("Login Error:", e);
    return {
      success: false,
      message: e.message || "Invalid email or password.",
    };
  }

  // --- Success Case ---
  // On successful login, we still redirect.
  redirect("/dashboard");

  // Note: redirect() throws an exception, so code below it won't run.
  // The return type is still required by TypeScript.
  // We won't actually hit this return statement.
  return { success: true, message: "Login successful!" };
}

export async function clearError() {
  "use server";
  redirect("/login");
}
