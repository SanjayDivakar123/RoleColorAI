-- Row Level Security (RLS) Policies for RoleColorAI
-- This migration sets up security policies to ensure users can only access their own data

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Resumes table policies
-- Users can only access their own resumes
CREATE POLICY "Users can view own resumes" ON resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes" ON resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON resumes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON resumes
    FOR DELETE USING (auth.uid() = user_id);

-- Exports table policies
-- Users can only access exports for their own resumes
CREATE POLICY "Users can view own exports" ON exports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM resumes 
            WHERE resumes.id = exports.resume_id 
            AND resumes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own exports" ON exports
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM resumes 
            WHERE resumes.id = exports.resume_id 
            AND resumes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own exports" ON exports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM resumes 
            WHERE resumes.id = exports.resume_id 
            AND resumes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own exports" ON exports
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM resumes 
            WHERE resumes.id = exports.resume_id 
            AND resumes.user_id = auth.uid()
        )
    );

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, plan)
    VALUES (NEW.id, NEW.email, 'free');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create storage policies for file uploads
-- Note: These policies assume you have created storage buckets named 'resumes' and 'exports'

-- Storage policy for resumes bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('exports', 'exports', false);

-- Allow users to upload to their own folder in resumes bucket
CREATE POLICY "Users can upload own resumes" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'resumes' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to view their own resume files
CREATE POLICY "Users can view own resume files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'resumes' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to delete their own resume files
CREATE POLICY "Users can delete own resume files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'resumes' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow users to download from their own folder in exports bucket
CREATE POLICY "Users can download own exports" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'exports' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow system to upload to exports bucket (for generated files)
CREATE POLICY "System can upload exports" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'exports');

-- Allow users to delete their own export files
CREATE POLICY "Users can delete own export files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'exports' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
