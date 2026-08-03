-- ========================================================
-- store-work-hub Supabase Database Setup Schema
-- Run this script in your Supabase Dashboard -> SQL Editor
-- ========================================================

-- 1. Create Profiles / Staff Users Table
CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  role TEXT DEFAULT '직원',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Stores Table
CREATE TABLE IF NOT EXISTS stores (
  id TEXT PRIMARY KEY,
  biz_no TEXT,
  region TEXT,
  store_name TEXT NOT NULL,
  owner_name TEXT,
  phone TEXT,
  address TEXT,
  manager TEXT,
  status TEXT DEFAULT '영업중',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- 4. Create Work Requests Table (with Author Name & User ID)
CREATE TABLE IF NOT EXISTS work_requests (
  id TEXT PRIMARY KEY,
  store_id TEXT,
  biz_no TEXT,
  region TEXT,
  store_name TEXT NOT NULL,
  category TEXT NOT NULL,
  target_team TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT '요청중',
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  author_id TEXT,
  author_name TEXT NOT NULL,
  author_user_id TEXT NOT NULL
);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE app_users;
ALTER PUBLICATION supabase_realtime ADD TABLE departments;
ALTER PUBLICATION supabase_realtime ADD TABLE stores;
ALTER PUBLICATION supabase_realtime ADD TABLE work_requests;

-- Enable public access policies (RLS disabled or allowed for simplicity)
ALTER TABLE app_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE departments DISABLE ROW LEVEL SECURITY;
ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_requests DISABLE ROW LEVEL SECURITY;
