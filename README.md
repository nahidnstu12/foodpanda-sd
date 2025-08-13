### User

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

###

-- CUSTOMER_PROFILE now has a direct, one-to-one link to a USER
CUSTOMER_PROFILE (
user_id PK FK_USER, -- Primary Key and Foreign Key
first_name,
last_name,
dob,
gender,
photo_url
)

-- RIDER_PROFILE is also strictly linked to one USER
RIDER_PROFILE (
user_id PK FK_USER,
first_name,
last_name,
dob,
gender,
photo_url,
vehicle_settings JSONB,
licence_info JSONB,
availability_schedule JSONB, -- JSONB is great for flexible schedules
rating,
attachments JSONB -- Use JSONB for unstructured data like a list of file URLs
)

-- PARTNER_PROFILE for restaurant owners, linked to one USER
PARTNER_PROFILE (
id PK, -- Partners can be businesses, so a separate ID might be better
owner_user_id FK_USER, -- The user who owns/manages this partner account
name,
operating_hours JSONB,
trade_licence_url,
bank_account_details JSONB,
attachments JSONB
business_registration_number,
tax_id,
contact_number,
operating_hours,
address_id,
restaurant_type,
trade_licence_number,
bank_account_details
)

-- PERMISSIONS table is great as-is
PERMISSIONS (
id PK,
name, -- e.g., 'Create Order'
key UNIQUE, -- e.g., 'order:create'
group_name, -- e.g., 'Order Management'
description,
created_at,
updated_at,
deleted_at
)

-- ROLES table is also great as-is
ROLES (
id PK,
name, -- e.g., 'Customer'
key UNIQUE, -- e.g., 'customer'
description,
created_at,
updated_at,
deleted_at
)

-- This table connects a USER to one or more ROLES
USER_ROLES (
user_id FK_USER,
role_id FK_ROLES,
PRIMARY KEY (user_id, role_id) -- Composite primary key
)

-- This table connects a ROLE to one or more PERMISSIONS
ROLE_PERMISSIONS (
role_id FK_ROLES,
permission_id FK_PERMISSIONS,
PRIMARY KEY (role_id, permission_id) -- Composite primary key
)

ADDRESS (
id PK,
user_id FK_USER NULLABLE, -- For a customer's address
partner_profile_id FK_PARTNER_PROFILE NULLABLE, -- For a restaurant's address
country,
city,
state,
road,
address,
zip_number,
post_code,
latitude,
longitude,
address_type, -- e.g., 'home', 'work', 'restaurant_location'
is_primary,
created_at,
updated_at,
deleted_at

-- Ensures an address belongs to either a user OR a partner, but not both.
CONSTRAINT chk_address_owner CHECK (
(user_id IS NOT NULL AND partner_profile_id IS NULL) OR
(user_id IS NULL AND partner_profile_id IS NOT NULL)
)
)
