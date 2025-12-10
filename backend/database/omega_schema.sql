
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS "roles" CASCADE;
CREATE TABLE "roles" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) UNIQUE NOT NULL,
    "description" TEXT,
    "permissions" JSONB
);

DROP TABLE IF EXISTS "users" CASCADE;
CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "username" VARCHAR(50) UNIQUE,
    "password_hash" VARCHAR(255),
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone_number" VARCHAR(20) UNIQUE,
    "avatar_url" TEXT,
    "role_id" INT REFERENCES "roles" ("id") ON DELETE SET NULL,
    "is_email_verified" BOOLEAN DEFAULT FALSE,
    "is_phone_verified" BOOLEAN DEFAULT FALSE,
    "status" VARCHAR(20) DEFAULT 'active',
    "bio" TEXT,
    "address_line1" VARCHAR(255),
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "zip_code" VARCHAR(20),
    "provider" VARCHAR(50) DEFAULT 'local',
    "provider_id" VARCHAR(255),
    "last_login_at" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS "audit_logs" CASCADE;
CREATE TABLE "audit_logs" (
    "id" SERIAL PRIMARY KEY,
    "admin_id" UUID REFERENCES "users" ("id"),
    "action" VARCHAR(100) NOT NULL,
    "target_id" UUID,
    "target_table" VARCHAR(50),
    "details" JSONB,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS "locations" CASCADE;
CREATE TABLE "locations" (
    "id" SERIAL PRIMARY KEY,
    "city" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL DEFAULT 'Vietnam',
    "image_url" TEXT,
    "is_popular" BOOLEAN DEFAULT FALSE
);

DROP TABLE IF EXISTS "properties" CASCADE;
CREATE TABLE "properties" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "host_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "manager_id" UUID REFERENCES "users" ("id"),
    "location_id" INT REFERENCES "locations" ("id"),
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT,
    "type" VARCHAR(50) NOT NULL,
    "address_full" TEXT NOT NULL,
    "latitude" DECIMAL(10, 8),
    "longitude" DECIMAL(11, 8),
    "check_in_time" TIME DEFAULT '14:00',
    "check_out_time" TIME DEFAULT '12:00',
    "status" VARCHAR(20) DEFAULT 'pending_approval',
    "rejection_reason" TEXT,
    "is_featured" BOOLEAN DEFAULT FALSE,
    "rating_avg" DECIMAL(3, 2) DEFAULT 0,
    "review_count" INT DEFAULT 0,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


DROP TABLE IF EXISTS "property_approvals" CASCADE;
CREATE TABLE "property_approvals" (
    "id" SERIAL PRIMARY KEY,
    "property_id" UUID REFERENCES "properties" ("id") ON DELETE CASCADE,
    "requested_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "reviewed_by" UUID REFERENCES "users" ("id"),
    "reviewed_at" TIMESTAMP WITH TIME ZONE,
    "status" VARCHAR(20) DEFAULT 'pending',
    "admin_notes" TEXT
);

DROP TABLE IF EXISTS "property_images" CASCADE;
CREATE TABLE "property_images" (
    "id" SERIAL PRIMARY KEY,
    "property_id" UUID REFERENCES "properties" ("id") ON DELETE CASCADE,
    "url" TEXT NOT NULL,
    "caption" VARCHAR(100),
    "is_main" BOOLEAN DEFAULT FALSE,
    "sort_order" INT DEFAULT 0
);

DROP TABLE IF EXISTS "rooms" CASCADE;
CREATE TABLE "rooms" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "property_id" UUID NOT NULL REFERENCES "properties" ("id") ON DELETE CASCADE,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(15, 2) NOT NULL,
    "stock_quantity" INT DEFAULT 1,
    "max_adults" INT DEFAULT 2,
    "max_children" INT DEFAULT 0,
    "size_sqm" INT,
    "bed_config" JSONB, -- e.g., {"king": 1, "sofa": 1}
    "is_active" BOOLEAN DEFAULT TRUE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "room_availability" CASCADE;
CREATE TABLE "room_availability" (
    "id" SERIAL PRIMARY KEY,
    "room_id" UUID REFERENCES "rooms" ("id") ON DELETE CASCADE,
    "date" DATE NOT NULL,
    "is_available" BOOLEAN DEFAULT TRUE,
    "price_override" DECIMAL(15, 2),
    "booked_count" INT DEFAULT 0,
    UNIQUE("room_id", "date")
);

DROP TABLE IF EXISTS "amenities" CASCADE;
CREATE TABLE "amenities" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) UNIQUE NOT NULL,
    "icon" VARCHAR(50),
    "type" VARCHAR(50) DEFAULT 'general'
);

DROP TABLE IF EXISTS "property_amenities" CASCADE;
CREATE TABLE "property_amenities" (
    "property_id" UUID REFERENCES "properties" ("id") ON DELETE CASCADE,
    "amenity_id" INT REFERENCES "amenities" ("id") ON DELETE CASCADE,
    PRIMARY KEY ("property_id", "amenity_id")
);

DROP TABLE IF EXISTS "bookings" CASCADE;
CREATE TABLE "bookings" (
    "id" VARCHAR(20) PRIMARY KEY, -- BK-20231209-123
    "user_id" UUID REFERENCES "users" ("id") ON DELETE SET NULL, -- Guest
    "property_id" UUID REFERENCES "properties" ("id"),
    "room_id" UUID REFERENCES "rooms" ("id"),
    "total_price" DECIMAL(15, 2) NOT NULL,
    "discount_amount" DECIMAL(15, 2) DEFAULT 0,
    "tax_amount" DECIMAL(15, 2) DEFAULT 0,
    "final_price" DECIMAL(15, 2) NOT NULL,
    "check_in_date" DATE NOT NULL,
    "check_out_date" DATE NOT NULL,
    "guest_count" INT DEFAULT 1,
    "status" VARCHAR(20) DEFAULT 'pending',
    "payment_status" VARCHAR(20) DEFAULT 'unpaid',
    "cancellation_policy" VARCHAR(50) DEFAULT 'flexible',
    "special_requests" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "coupons" CASCADE;
CREATE TABLE "coupons" (
    "id" SERIAL PRIMARY KEY,
    "code" VARCHAR(50) UNIQUE NOT NULL,
    "discount_type" VARCHAR(20) DEFAULT 'percentage',
    "value" DECIMAL(15, 2) NOT NULL,
    "max_usage" INT,
    "used_count" INT DEFAULT 0,
    "start_date" TIMESTAMP,
    "end_date" TIMESTAMP,
    "is_active" BOOLEAN DEFAULT TRUE
);

DROP TABLE IF EXISTS "payments" CASCADE;
CREATE TABLE "payments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "booking_id" VARCHAR(20) REFERENCES "bookings" ("id") ON DELETE CASCADE,
    "amount" DECIMAL(15, 2) NOT NULL,
    "method" VARCHAR(50) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'pending',
    "transaction_gateway_id" VARCHAR(255),
    "payment_date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "reviews" CASCADE;
CREATE TABLE "reviews" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "booking_id" VARCHAR(20) REFERENCES "bookings" ("id") ON DELETE CASCADE,
    "user_id" UUID REFERENCES "users" ("id") ON DELETE CASCADE,
    "property_id" UUID REFERENCES "properties" ("id") ON DELETE CASCADE,
    "rating" INT CHECK (rating >= 1 AND rating <= 5),
    "cleanliness" INT CHECK (cleanliness >= 1 AND cleanliness <= 5),
    "accuracy" INT CHECK (accuracy >= 1 AND accuracy <= 5),
    "communication" INT CHECK (communication >= 1 AND communication <= 5),
    "check_in" INT CHECK (check_in >= 1 AND check_in <= 5),
    "value" INT CHECK (value >= 1 AND value <= 5),
    "comment" TEXT,
    "response" TEXT,
    "is_hidden" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS "notifications" CASCADE;
CREATE TABLE "notifications" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID REFERENCES "users" ("id") ON DELETE CASCADE,
    "type" VARCHAR(50) NOT NULL, -- 'booking_confirmed', 'payment_success', 'new_message'
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN DEFAULT FALSE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
