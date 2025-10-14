-- RoleColorAI Initial Database Schema
-- This migration creates the core tables for the RoleColorAI platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_plan AS ENUM ('free', 'premium', 'pro', 'white_label');
CREATE TYPE resume_status AS ENUM ('uploaded', 'parsed', 'rewritten', 'exported');
CREATE TYPE export_format AS ENUM ('pdf', 'docx');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    plan user_plan NOT NULL DEFAULT 'free',
    rolecolor_profile JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Resumes table
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_file_url TEXT NOT NULL,
    parsed_json JSONB,
    rewritten_json JSONB,
    status resume_status NOT NULL DEFAULT 'uploaded',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger to resumes table
CREATE TRIGGER update_resumes_updated_at 
    BEFORE UPDATE ON resumes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Exports table
CREATE TABLE exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    format export_format NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger to exports table
CREATE TRIGGER update_exports_updated_at 
    BEFORE UPDATE ON exports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_status ON resumes(status);
CREATE INDEX idx_resumes_created_at ON resumes(created_at DESC);
CREATE INDEX idx_exports_resume_id ON exports(resume_id);
CREATE INDEX idx_exports_format ON exports(format);
CREATE INDEX idx_exports_created_at ON exports(created_at DESC);

-- Create GIN indexes for JSONB columns
CREATE INDEX idx_users_rolecolor_profile ON users USING GIN(rolecolor_profile);
CREATE INDEX idx_resumes_parsed_json ON resumes USING GIN(parsed_json);
CREATE INDEX idx_resumes_rewritten_json ON resumes USING GIN(rewritten_json);

-- Comments for documentation
COMMENT ON TABLE users IS 'User profiles with RoleColor assessment data';
COMMENT ON COLUMN users.rolecolor_profile IS 'JSONB containing RoleColor assessment results (builder, enabler, thriver, supportee scores)';
COMMENT ON TABLE resumes IS 'Uploaded resumes and their processing status';
COMMENT ON COLUMN resumes.parsed_json IS 'Structured resume data extracted by OpenAI';
COMMENT ON COLUMN resumes.rewritten_json IS 'RoleColor-optimized resume data';
COMMENT ON TABLE exports IS 'Generated resume files (PDF/DOCX) ready for download';
