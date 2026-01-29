-- ============================================
-- CARENET - FASE 1: LOGIN & SETUP (CORRECTED)
-- ============================================

-- 1. EXTENSIONS SETUP
-- PostGIS is required for the GEOGRAPHY type
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. ENUMS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('elderly', 'family_supervisor', 'professional');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_state') THEN
        CREATE TYPE user_state AS ENUM ('independent', 'assisted', 'dependent');
    END IF;
END $$;

-- 4. TABLES

-- ===== USERS =====
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ===== RELATIONSHIPS =====
CREATE TABLE IF NOT EXISTS relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  elderly_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  related_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (
    relationship_type IN ('family_supervisor', 'doctor', 'nurse', 'oss', 'physiotherapist', 'other')
  ),
  specialization TEXT,
  organization TEXT,
  report_frequency TEXT CHECK (report_frequency IN ('daily', 'weekly', 'monthly')),
  report_email TEXT,
  next_report_due TIMESTAMPTZ,
  permissions JSONB DEFAULT '{
    "can_view_events": false,
    "can_view_medications": true,
    "can_view_medical_info": true,
    "can_modify_profile": false
  }'::JSONB,
  active BOOLEAN DEFAULT TRUE,
  invitation_code TEXT UNIQUE,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  invited_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(elderly_id, related_user_id),
  CHECK (elderly_id != related_user_id)
);

-- ===== ELDERLY_PROFILES =====
CREATE TABLE IF NOT EXISTS elderly_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('M', 'F', 'other')),
  height_cm INTEGER CHECK (height_cm > 0 AND height_cm < 300),
  weight_kg DECIMAL CHECK (weight_kg > 0 AND weight_kg < 500),
  current_state user_state NOT NULL DEFAULT 'independent',
  thresholds JSONB NOT NULL DEFAULT '{
    "no_movement_hours": 12,
    "min_daily_steps": 1000,
    "heart_rate_min": 50,
    "heart_rate_max": 100
  }'::JSONB,
  home_address TEXT,
  home_coords GEOGRAPHY(POINT, 4326), -- Specifically using WGS84 SRID
  home_radius_meters INTEGER DEFAULT 100 CHECK (home_radius_meters > 0),
  learned_patterns JSONB DEFAULT '{}'::JSONB,
  state_changed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial Index for performance
CREATE INDEX IF NOT EXISTS idx_elderly_profiles_coords ON elderly_profiles USING GIST (home_coords);

-- ===== MEDICAL_INFO =====
CREATE TABLE IF NOT EXISTS medical_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  elderly_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  info_type TEXT NOT NULL CHECK (
    info_type IN ('condition', 'allergy', 'limitation', 'diet', 'note')
  ),
  name TEXT NOT NULL,
  details JSONB DEFAULT '{}'::JSONB,
  added_by UUID REFERENCES users(id),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== USER_DEVICES =====
CREATE TABLE IF NOT EXISTS user_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('ios', 'android', 'web')),
  fcm_token TEXT,
  push_enabled BOOLEAN DEFAULT TRUE,
  timezone TEXT DEFAULT 'Europe/Rome',
  language TEXT DEFAULT 'it',
  last_active TIMESTAMPTZ DEFAULT NOW(),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

-- 5. TRIGGERS
-- Re-applying triggers (using a loop or individual statements)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'users_updated_at') THEN
        CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'elderly_profiles_updated_at') THEN
        CREATE TRIGGER elderly_profiles_updated_at BEFORE UPDATE ON elderly_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'medical_info_updated_at') THEN
        CREATE TRIGGER medical_info_updated_at BEFORE UPDATE ON medical_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 6. ENABLE RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE elderly_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;