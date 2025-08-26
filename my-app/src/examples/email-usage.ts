import {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendRiderAssignmentEmail,
  sendPartnerWelcomeEmail,
  sendRiderWelcomeEmail,
  verifyEmailConfig,
} from "../actions/send-email";

// Example usage functions for different scenarios

/**
 * User Registration Flow
 */
export async function handleUserRegistration(
  userEmail: string,
  userName: string
) {
  try {
    // 1. Send welcome email
    const welcomeResult = await sendWelcomeEmail(userEmail, userName);
    console.log("Welcome email result:", welcomeResult);

    // 2. Send verification email
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=abc123`;
    const verificationResult = await sendVerificationEmail(
      userEmail,
      userName,
      verificationLink
    );
    console.log("Verification email result:", verificationResult);

    return { welcomeResult, verificationResult };
  } catch (error) {
    console.error("Failed to send registration emails:", error);
    throw error;
  }
}

/**
 * Password Reset Flow
 */
export async function handlePasswordReset(userEmail: string, userName: string) {
  try {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=xyz789`;
    const result = await sendPasswordResetEmail(userEmail, userName, resetLink);
    console.log("Password reset email result:", result);
    return result;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}

/**
 * Order Processing Flow
 */
export async function handleOrderProcessing(
  userEmail: string,
  userName: string,
  orderId: string,
  restaurantName: string
) {
  try {
    // 1. Send order confirmation
    const orderDetails = {
      orderId,
      orderDate: new Date().toLocaleDateString(),
      totalAmount: "25.99",
      estimatedDelivery: "35-45 minutes",
    };

    const confirmationResult = await sendOrderConfirmationEmail(
      userEmail,
      userName,
      orderDetails,
      restaurantName
    );
    console.log("Order confirmation email result:", confirmationResult);

    // 2. Later, when rider is assigned
    const riderDetails = {
      orderId,
      estimatedArrival: "15-20 minutes",
      vehicleType: "Motorcycle",
    };

    const riderResult = await sendRiderAssignmentEmail(
      userEmail,
      userName,
      "John Doe",
      riderDetails
    );
    console.log("Rider assignment email result:", riderResult);

    return { confirmationResult, riderResult };
  } catch (error) {
    console.error("Failed to send order emails:", error);
    throw error;
  }
}

/**
 * Partner Onboarding Flow
 */
export async function handlePartnerOnboarding(
  partnerEmail: string,
  partnerName: string
) {
  try {
    const result = await sendPartnerWelcomeEmail(partnerEmail, partnerName);
    console.log("Partner welcome email result:", result);
    return result;
  } catch (error) {
    console.error("Failed to send partner welcome email:", error);
    throw error;
  }
}

/**
 * Rider Onboarding Flow
 */
export async function handleRiderOnboarding(
  riderEmail: string,
  riderName: string
) {
  try {
    const result = await sendRiderWelcomeEmail(riderEmail, riderName);
    console.log("Rider welcome email result:", result);
    return result;
  } catch (error) {
    console.error("Failed to send rider welcome email:", error);
    throw error;
  }
}

/**
 * Bulk Email Campaign
 */
export async function sendBulkWelcomeEmails(
  users: Array<{ email: string; name: string }>
) {
  try {
    const results = [];

    for (const user of users) {
      const result = await sendWelcomeEmail(user.email, user.name);
      results.push({ user: user.email, result });

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log("Bulk welcome emails sent:", results);
    return results;
  } catch (error) {
    console.error("Failed to send bulk welcome emails:", error);
    throw error;
  }
}

/**
 * Email System Health Check
 */
export async function checkEmailSystemHealth() {
  try {
    const configResult = await verifyEmailConfig();
    console.log("Email configuration check:", configResult);
    return configResult;
  } catch (error) {
    console.error("Email system health check failed:", error);
    throw error;
  }
}

// Example usage in API routes or server actions:

/*
// In your signup API route:
export async function POST(request: Request) {
  const { email, name } = await request.json();
  
  // Create user in database
  const user = await createUser({ email, name });
  
  // Send welcome and verification emails
  await handleUserRegistration(email, name);
  
  return Response.json({ success: true, user });
}

// In your order API route:
export async function POST(request: Request) {
  const { userId, restaurantId, items } = await request.json();
  
  // Create order in database
  const order = await createOrder({ userId, restaurantId, items });
  
  // Get user and restaurant details
  const user = await getUser(userId);
  const restaurant = await getRestaurant(restaurantId);
  
  // Send order confirmation email
  await handleOrderProcessing(user.email, user.name, order.id, restaurant.name);
  
  return Response.json({ success: true, order });
}

// In your password reset API route:
export async function POST(request: Request) {
  const { email } = await request.json();
  
  // Generate reset token
  const resetToken = generateResetToken();
  await saveResetToken(email, resetToken);
  
  // Get user details
  const user = await getUserByEmail(email);
  
  // Send password reset email
  await handlePasswordReset(email, user.name);
  
  return Response.json({ success: true, message: "Reset email sent" });
}
*/
