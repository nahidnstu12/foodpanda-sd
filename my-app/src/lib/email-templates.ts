export interface EmailTemplateData {
  userName?: string;
  verificationLink?: string;
  resetLink?: string;
  orderDetails?: any;
  riderName?: string;
  partnerName?: string;
  restaurantName?: string;
  [key: string]: any;
}

export const emailTemplates = {
  // User Registration & Welcome
  welcome: (data: EmailTemplateData) => ({
    subject: "Welcome to Quick Serve! 🍕",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Quick Serve</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; padding: 12px 24px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍕 Welcome to Quick Serve!</h1>
            <p>Your food delivery journey starts here</p>
          </div>
          <div class="content">
            <h2>Hi ${data.userName || "there"}! 👋</h2>
            <p>Welcome to Quick Serve! We're excited to have you join our community of food lovers.</p>
            
            <div class="highlight">
              <h3>🚀 What you can do now:</h3>
              <ul>
                <li>Browse thousands of restaurants</li>
                <li>Order your favorite dishes</li>
                <li>Track deliveries in real-time</li>
                <li>Earn rewards and discounts</li>
              </ul>
            </div>
            
            <p><strong>Next steps:</strong></p>
            <ol>
              <li>Complete your profile</li>
              <li>Add your delivery address</li>
              <li>Browse restaurants in your area</li>
              <li>Place your first order!</li>
            </ol>
            
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "https://Quick Serve.com"
            }" class="btn">Start Ordering Now</a>
            
            <p>If you have any questions, our support team is here to help!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Quick Serve. All rights reserved.</p>
            <p>Follow us on social media for updates and offers!</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to Quick Serve! 🍕

Hi ${data.userName || "there"}! 👋

Welcome to Quick Serve! We're excited to have you join our community of food lovers.

🚀 What you can do now:
- Browse thousands of restaurants
- Order your favorite dishes
- Track deliveries in real-time
- Earn rewards and discounts

Next steps:
1. Complete your profile
2. Add your delivery address
3. Browse restaurants in your area
4. Place your first order!

Start ordering at: ${
      process.env.NEXT_PUBLIC_APP_URL || "https://Quick Serve.com"
    }

If you have any questions, our support team is here to help!

© ${new Date().getFullYear()} Quick Serve. All rights reserved.
    `,
  }),

  // Email Verification
  emailVerification: (data: EmailTemplateData) => ({
    subject: "Verify Your Email - Quick Serve",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; padding: 12px 24px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Verify Your Email</h1>
            <p>Quick Serve Account Verification</p>
          </div>
          <div class="content">
            <h2>Hi ${data.userName || "there"}! 👋</h2>
            <p>Thanks for signing up with Quick Serve! To complete your registration, please verify your email address.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${
                data.verificationLink
              }" class="btn">Verify Email Address</a>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Important:</strong> This link will expire in 24 hours for security reasons.</p>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${data.verificationLink}
            </p>
            
            <p>If you didn't create a Quick Serve account, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Quick Serve. All rights reserved.</p>
            <p>This is an automated email, please don't reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
📧 Verify Your Email - Quick Serve

Hi ${data.userName || "there"}! 👋

Thanks for signing up with Quick Serve! To complete your registration, please verify your email address.

Verify your email: ${data.verificationLink}

⚠️ Important: This link will expire in 24 hours for security reasons.

If the link doesn't work, copy and paste this URL into your browser:
${data.verificationLink}

If you didn't create a Quick Serve account, you can safely ignore this email.

© ${new Date().getFullYear()} Quick Serve. All rights reserved.
This is an automated email, please don't reply.
    `,
  }),

  // Password Reset
  passwordReset: (data: EmailTemplateData) => ({
    subject: "Reset Your Password - Quick Serve",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; padding: 12px 24px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          .security { background: #d1ecf1; padding: 15px; border-left: 4px solid #17a2b8; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Your Password</h1>
            <p>Quick Serve Account Security</p>
          </div>
          <div class="content">
            <h2>Hi ${data.userName || "there"}! 👋</h2>
            <p>We received a request to reset your Quick Serve account password.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.resetLink}" class="btn">Reset Password</a>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Important:</strong> This link will expire in 1 hour for security reasons.</p>
            </div>
            
            <div class="security">
              <p><strong>🔒 Security Tips:</strong></p>
              <ul>
                <li>Never share your password with anyone</li>
                <li>Use a strong, unique password</li>
                <li>Enable two-factor authentication if available</li>
              </ul>
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
              ${data.resetLink}
            </p>
            
            <p>If you didn't request a password reset, please ignore this email or contact our support team immediately.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Quick Serve. All rights reserved.</p>
            <p>This is an automated email, please don't reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
🔐 Reset Your Password - Quick Serve

Hi ${data.userName || "there"}! 👋

We received a request to reset your Quick Serve account password.

Reset your password: ${data.resetLink}

⚠️ Important: This link will expire in 1 hour for security reasons.

🔒 Security Tips:
- Never share your password with anyone
- Use a strong, unique password
- Enable two-factor authentication if available

If the link doesn't work, copy and paste this URL into your browser:
${data.resetLink}

If you didn't request a password reset, please ignore this email or contact our support team immediately.

© ${new Date().getFullYear()} Quick Serve. All rights reserved.
This is an automated email, please don't reply.
    `,
  }),

  // Order Confirmation
  orderConfirmation: (data: EmailTemplateData) => ({
    subject: `Order Confirmed - #${
      data.orderDetails?.orderId || "N/A"
    } - Quick Serve`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ddd; }
          .status { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .btn { display: inline-block; padding: 12px 24px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
            <p>Your food is being prepared</p>
          </div>
          <div class="content">
            <h2>Hi ${data.userName || "there"}! 👋</h2>
            <p>Great news! Your order has been confirmed and is being prepared.</p>
            
            <div class="status">
              <h3>🔄 Status: Order Confirmed</h3>
              <p>Estimated delivery time: ${
                data.orderDetails?.estimatedDelivery || "30-45 minutes"
              }</p>
            </div>
            
            <div class="order-details">
              <h3>📋 Order Details</h3>
              <p><strong>Order ID:</strong> #${
                data.orderDetails?.orderId || "N/A"
              }</p>
              <p><strong>Restaurant:</strong> ${
                data.restaurantName || "N/A"
              }</p>
              <p><strong>Order Date:</strong> ${
                data.orderDetails?.orderDate || "N/A"
              }</p>
              <p><strong>Total Amount:</strong> $${
                data.orderDetails?.totalAmount || "N/A"
              }</p>
            </div>
            
            <p>We'll send you updates as your order progresses through preparation, pickup, and delivery.</p>
            
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "https://Quick Serve.com"
            }/orders/${
      data.orderDetails?.orderId
    }" class="btn">Track Your Order</a>
            
            <p>Thank you for choosing Quick Serve!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Quick Serve. All rights reserved.</p>
            <p>Questions? Contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
✅ Order Confirmed! - Quick Serve

Hi ${data.userName || "there"}! 👋

Great news! Your order has been confirmed and is being prepared.

🔄 Status: Order Confirmed
Estimated delivery time: ${
      data.orderDetails?.estimatedDelivery || "30-45 minutes"
    }

📋 Order Details:
Order ID: #${data.orderDetails?.orderId || "N/A"}
Restaurant: ${data.restaurantName || "N/A"}
Order Date: ${data.orderDetails?.orderDate || "N/A"}
Total Amount: $${data.orderDetails?.totalAmount || "N/A"}

We'll send you updates as your order progresses through preparation, pickup, and delivery.

Track your order: ${
      process.env.NEXT_PUBLIC_APP_URL || "https://Quick Serve.com"
    }/orders/${data.orderDetails?.orderId}

Thank you for choosing Quick Serve!

© ${new Date().getFullYear()} Quick Serve. All rights reserved.
Questions? Contact our support team.
    `,
  }),

  // Rider Assignment
  riderAssignment: (data: EmailTemplateData) => ({
    subject: "Your Rider is on the Way! 🚚 - Quick Serve",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rider Assigned</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .rider-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 1px solid #ddd; text-align: center; }
          .status { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .btn { display: inline-block; padding: 12px 24px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 Your Rider is on the Way!</h1>
            <p>Order #${data.orderDetails?.orderId || "N/A"}</p>
          </div>
          <div class="content">
            <h2>Hi ${data.userName || "there"}! 👋</h2>
            <p>Great news! Your order has been picked up and is now on its way to you.</p>
            
            <div class="status">
              <h3>🔄 Status: Out for Delivery</h3>
              <p>Estimated arrival: ${
                data.orderDetails?.estimatedArrival || "15-20 minutes"
              }</p>
            </div>
            
            <div class="rider-info">
              <h3>🚴‍♂️ Your Rider</h3>
              <p><strong>Name:</strong> ${data.riderName || "N/A"}</p>
              <p><strong>Vehicle:</strong> ${
                data.orderDetails?.vehicleType || "Motorcycle"
              }</p>
              <p><strong>Order ID:</strong> #${
                data.orderDetails?.orderId || "N/A"
              }</p>
            </div>
            
            <p>Your rider will contact you when they arrive. Please ensure someone is available to receive the order.</p>
            
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "https://Quick Serve.com"
            }/orders/${
      data.orderDetails?.orderId
    }" class="btn">Track Live Location</a>
            
            <p><strong>💡 Tip:</strong> Keep your phone nearby for any rider updates!</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Quick Serve. All rights reserved.</p>
            <p>Questions? Contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
🚚 Your Rider is on the Way! - Quick Serve

Hi ${data.userName || "there"}! 👋

Great news! Your order has been picked up and is now on its way to you.

🔄 Status: Out for Delivery
Estimated arrival: ${data.orderDetails?.estimatedArrival || "15-20 minutes"}

🚴‍♂️ Your Rider:
Name: ${data.riderName || "N/A"}
Vehicle: ${data.orderDetails?.vehicleType || "Motorcycle"}
Order ID: #${data.orderDetails?.orderId || "N/A"}

Your rider will contact you when they arrive. Please ensure someone is available to receive the order.

Track live location: ${
      process.env.NEXT_PUBLIC_APP_URL || "https://Quick Serve.com"
    }/orders/${data.orderDetails?.orderId}

💡 Tip: Keep your phone nearby for any rider updates!

© ${new Date().getFullYear()} Quick Serve. All rights reserved.
Questions? Contact our support team.
    `,
  }),

  // Partner Welcome
  partnerWelcome: (data: EmailTemplateData) => ({
    subject: "Welcome to Quick Serve Partner Network! 🏪",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Partner Welcome</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          .btn { display: inline-block; padding: 12px 24px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏪 Welcome to Quick Serve Partner Network!</h1>
            <p>Grow Your Business with Us</p>
          </div>
          <div class="content">
            <h2>Hi ${data.partnerName || "there"}! 👋</h2>
            <p>Welcome to the Quick Serve family! We're excited to partner with you and help grow your restaurant business.</p>
            
            <div class="highlight">
              <h3>🎯 What's Next:</h3>
              <ol>
                <li><strong>Complete Setup:</strong> Add your menu, photos, and business details</li>
                <li><strong>Training:</strong> Attend our partner onboarding session</li>
                <li><strong>Go Live:</strong> Start receiving orders from hungry customers</li>
                <li><strong>Grow:</strong> Access our marketing tools and analytics</li>
              </ol>
            </div>
            
            <h3>🚀 Benefits of Partnering with Quick Serve:</h3>
            <ul>
              <li>Reach thousands of new customers</li>
              <li>Increase your daily orders</li>
              <li>Access to our delivery network</li>
              <li>Marketing support and promotions</li>
              <li>Real-time analytics and insights</li>
              <li>24/7 partner support</li>
            </ul>
            
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "https://Quick Serve.com"
            }/partner/dashboard" class="btn">Access Partner Dashboard</a>
            
            <p><strong>📞 Need Help?</strong> Our partner success team is here to support you every step of the way.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Quick Serve. All rights reserved.</p>
            <p>Partner Success Team | partner@Quick Serve.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
🏪 Welcome to Quick Serve Partner Network!

Hi ${data.partnerName || "there"}! 👋

Welcome to the Quick Serve family! We're excited to partner with you and help grow your restaurant business.

🎯 What's Next:
1. Complete Setup: Add your menu, photos, and business details
2. Training: Attend our partner onboarding session
3. Go Live: Start receiving orders from hungry customers
4. Grow: Access our marketing tools and analytics

🚀 Benefits of Partnering with Quick Serve:
- Reach thousands of new customers
- Increase your daily orders
- Access to our delivery network
- Marketing support and promotions
- Real-time analytics and insights
- 24/7 partner support

Access partner dashboard: ${
      process.env.NEXT_PUBLIC_APP_URL || "https://Quick Serve.com"
    }/partner/dashboard

📞 Need Help? Our partner success team is here to support you every step of the way.

© ${new Date().getFullYear()} Quick Serve. All rights reserved.
Partner Success Team | partner@Quick Serve.com
    `,
  }),

  // Rider Welcome
  riderWelcome: (data: EmailTemplateData) => ({
    subject: "Welcome to Quick Serve Rider Team! 🚚",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rider Welcome</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          .btn { display: inline-block; padding: 12px 24px; background: #ff6b35; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 Welcome to Quick Serve Rider Team!</h1>
            <p>Join Our Delivery Network</p>
          </div>
          <div class="content">
            <h2>Hi ${data.riderName || "there"}! 👋</h2>
            <p>Welcome to the Quick Serve rider team! You're now part of our mission to deliver happiness, one order at a time.</p>
            
            <div class="highlight">
              <h3>🎯 Getting Started:</h3>
              <ol>
                <li><strong>Complete Profile:</strong> Upload documents and verify your identity</li>
                <li><strong>Training:</strong> Complete our safety and delivery training</li>
                <li><strong>Equipment:</strong> Get your Quick Serve delivery kit</li>
                <li><strong>Start Earning:</strong> Go online and accept delivery requests</li>
              </ol>
            </div>
            
            <h3>💰 Earn More with Quick Serve:</h3>
            <ul>
              <li>Competitive delivery fees</li>
              <li>Tips from satisfied customers</li>
              <li>Performance bonuses</li>
              <li>Flexible working hours</li>
              <li>Weekly payments</li>
              <li>Health and safety coverage</li>
            </ul>
            
            <a href="${
              process.env.NEXT_PUBLIC_APP_URL || "https://Quick Serve.com"
            }/rider/dashboard" class="btn">Access Rider Dashboard</a>
            
            <p><strong>📱 Download the Rider App:</strong> Available on Google Play Store and Apple App Store.</p>
            <p><strong>📞 Support:</strong> Our rider support team is available 24/7 to help you.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Quick Serve. All rights reserved.</p>
            <p>Rider Support Team | rider@Quick Serve.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
🚚 Welcome to Quick Serve Rider Team!

Hi ${data.riderName || "there"}! 👋

Welcome to the Quick Serve rider team! You're now part of our mission to deliver happiness, one order at a time.

🎯 Getting Started:
1. Complete Profile: Upload documents and verify your identity
2. Training: Complete our safety and delivery training
3. Equipment: Get your Quick Serve delivery kit
4. Start Earning: Go online and accept delivery requests

💰 Earn More with Quick Serve:
- Competitive delivery fees
- Tips from satisfied customers
- Performance bonuses
- Flexible working hours
- Weekly payments
- Health and safety coverage

Access rider dashboard: ${
      process.env.NEXT_PUBLIC_APP_URL || "https://Quick Serve.com"
    }/rider/dashboard

📱 Download the Rider App: Available on Google Play Store and Apple App Store.

📞 Support: Our rider support team is available 24/7 to help you.

© ${new Date().getFullYear()} Quick Serve. All rights reserved.
Rider Support Team | rider@Quick Serve.com
    `,
  }),
};
