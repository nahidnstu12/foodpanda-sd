# FoodPanda Email System

A comprehensive, scalable email system built for the FoodPanda delivery platform with beautiful HTML templates and multiple email types.

## Features

- 🎨 **Beautiful HTML Templates** - Professional, responsive email designs
- 📧 **Multiple Email Types** - Welcome, verification, password reset, order updates, etc.
- 🚀 **Scalable Architecture** - Easy to add new templates and email types
- 🔧 **Flexible Configuration** - Support for Gmail and custom SMTP servers
- 📱 **Mobile Responsive** - All templates work perfectly on mobile devices
- 🎯 **FoodPanda Specific** - Tailored for food delivery business needs

## Email Templates

### 1. User Registration & Welcome

- **Template**: `welcome`
- **Use Case**: New user signup
- **Content**: Welcome message, platform features, next steps

### 2. Email Verification

- **Template**: `emailVerification`
- **Use Case**: Account verification
- **Content**: Verification link, security notes, expiration warning

### 3. Password Reset

- **Template**: `passwordReset`
- **Use Case**: Password recovery
- **Content**: Reset link, security tips, expiration warning

### 4. Order Confirmation

- **Template**: `orderConfirmation`
- **Use Case**: Order placement confirmation
- **Content**: Order details, delivery estimate, tracking link

### 5. Rider Assignment

- **Template**: `riderAssignment`
- **Use Case**: When rider picks up order
- **Content**: Rider details, estimated arrival, live tracking

### 6. Partner Welcome

- **Template**: `partnerWelcome`
- **Use Case**: Restaurant partner onboarding
- **Content**: Partnership benefits, next steps, dashboard access

### 7. Rider Welcome

- **Template**: `riderWelcome`
- **Use Case**: Delivery rider onboarding
- **Content**: Getting started guide, earning potential, support info

## Quick Start

### 1. Environment Configuration

Add these variables to your `.env.local`:

```bash
# Gmail Configuration (default)
GMAIL_USERNAME="your-email@gmail.com"
GMAIL_PASSWORD="your-app-password"

# Alternative SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@foodpanda.com"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Basic Usage

```typescript
import { sendWelcomeEmail, sendVerificationEmail } from "@/actions/send-email";

// Send welcome email
await sendWelcomeEmail("user@example.com", "John Doe");

// Send verification email
const verificationLink = "https://yourapp.com/verify?token=abc123";
await sendVerificationEmail("user@example.com", "John Doe", verificationLink);
```

### 3. Advanced Usage

```typescript
import { emailService } from "@/lib/email-service";

// Custom email with template
await emailService.sendTemplateEmail({
  to: "user@example.com",
  template: "welcome",
  data: { userName: "John Doe" },
  cc: ["admin@foodpanda.com"],
  bcc: ["logs@foodpanda.com"],
});

// Bulk emails
const recipients = [
  { email: "user1@example.com", data: { userName: "User 1" } },
  { email: "user2@example.com", data: { userName: "User 2" } },
];

await emailService.sendBulkTemplateEmails(recipients, "welcome");
```

## API Reference

### Email Service Methods

#### `sendTemplateEmail(params)`

Send email using a specific template.

```typescript
interface SendEmailParams {
  to: string | string[];
  template: keyof typeof emailTemplates;
  data: EmailTemplateData;
  from?: string;
  subject?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}
```

#### `sendWelcomeEmail(to, userName)`

Send welcome email to new users.

#### `sendVerificationEmail(to, userName, verificationLink)`

Send email verification link.

#### `sendPasswordResetEmail(to, userName, resetLink)`

Send password reset link.

#### `sendOrderConfirmationEmail(to, userName, orderDetails, restaurantName)`

Send order confirmation email.

#### `sendRiderAssignmentEmail(to, userName, riderName, orderDetails)`

Send rider assignment notification.

#### `sendPartnerWelcomeEmail(to, partnerName)`

Send partner welcome email.

#### `sendRiderWelcomeEmail(to, riderName)`

Send rider welcome email.

### Template Data Interface

```typescript
interface EmailTemplateData {
  userName?: string;
  verificationLink?: string;
  resetLink?: string;
  orderDetails?: any;
  riderName?: string;
  partnerName?: string;
  restaurantName?: string;
  [key: string]: any;
}
```

## Customization

### Adding New Templates

1. Add template to `src/lib/email-templates.ts`:

```typescript
export const emailTemplates = {
  // ... existing templates

  newTemplate: (data: EmailTemplateData) => ({
    subject: "Your Subject",
    html: `<html>...</html>`,
    text: `Plain text version...`,
  }),
};
```

2. Add method to `EmailService` class:

```typescript
async sendNewTemplateEmail(to: string, data: EmailTemplateData) {
  return this.sendTemplateEmail({
    to,
    template: "newTemplate",
    data,
  });
}
```

3. Export from `src/actions/send-email.ts`:

```typescript
export async function sendNewTemplateEmail(
  to: string,
  data: EmailTemplateData
) {
  return emailService.sendNewTemplateEmail(to, data);
}
```

### Styling Templates

All templates use inline CSS for maximum email client compatibility. Key styling classes:

- `.container` - Main wrapper (600px max width)
- `.header` - Gradient header with brand colors
- `.content` - Main content area
- `.footer` - Dark footer
- `.btn` - Call-to-action buttons
- `.highlight` - Important information boxes
- `.warning` - Warning/alert boxes
- `.status` - Status indicators

## Email Client Compatibility

- ✅ Gmail (Web & Mobile)
- ✅ Outlook (Web & Desktop)
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Thunderbird
- ✅ Mobile email apps

## Best Practices

### 1. Rate Limiting

- Add delays between bulk emails (100ms recommended)
- Use email service provider's rate limits
- Implement queue system for large campaigns

### 2. Error Handling

- Always wrap email sending in try-catch
- Log errors for debugging
- Implement retry logic for failed emails

### 3. Testing

- Test templates in multiple email clients
- Use tools like Email on Acid or Litmus
- Test on mobile devices

### 4. Security

- Never expose SMTP credentials in client code
- Use environment variables for sensitive data
- Implement email validation and sanitization

## Troubleshooting

### Common Issues

1. **Authentication Failed**

   - Check SMTP credentials
   - Enable "Less secure app access" for Gmail
   - Use App Passwords for Gmail

2. **Emails Not Sending**

   - Verify SMTP configuration
   - Check firewall/network settings
   - Verify email service status

3. **Templates Not Rendering**
   - Check HTML syntax
   - Verify CSS compatibility
   - Test in different email clients

### Debug Mode

```typescript
// Verify email configuration
const healthCheck = await verifyEmailConfig();
console.log(healthCheck);

// Test connection
const emailService = new EmailService();
await emailService.verifyConnection();
```

## Performance Considerations

- **Connection Pooling**: Reuse SMTP connections
- **Async Processing**: Send emails in background
- **Template Caching**: Cache compiled templates
- **Bulk Operations**: Use bulk sending for multiple recipients

## Monitoring & Analytics

- Track email delivery rates
- Monitor bounce rates
- Log email sending metrics
- Implement email tracking (pixel tracking)

## Future Enhancements

- [ ] Email queue system with Redis
- [ ] A/B testing for templates
- [ ] Dynamic content based on user behavior
- [ ] Email analytics dashboard
- [ ] Template builder interface
- [ ] Multi-language support
- [ ] Email preference management

## Support

For issues or questions:

1. Check the troubleshooting section
2. Review email service logs
3. Test with minimal configuration
4. Verify environment variables

---

**Built with ❤️ for FoodPanda**
