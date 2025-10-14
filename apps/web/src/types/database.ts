export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          plan: 'free' | 'premium' | 'pro' | 'white_label'
          rolecolor_profile: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          plan?: 'free' | 'premium' | 'pro' | 'white_label'
          rolecolor_profile?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          plan?: 'free' | 'premium' | 'pro' | 'white_label'
          rolecolor_profile?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          original_file_url: string
          parsed_json: Json | null
          rewritten_json: Json | null
          status: 'uploaded' | 'parsed' | 'rewritten' | 'exported'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_file_url: string
          parsed_json?: Json | null
          rewritten_json?: Json | null
          status?: 'uploaded' | 'parsed' | 'rewritten' | 'exported'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_file_url?: string
          parsed_json?: Json | null
          rewritten_json?: Json | null
          status?: 'uploaded' | 'parsed' | 'rewritten' | 'exported'
          created_at?: string
          updated_at?: string
        }
      }
      exports: {
        Row: {
          id: string
          resume_id: string
          file_url: string
          format: 'pdf' | 'docx'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          resume_id: string
          file_url: string
          format: 'pdf' | 'docx'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          resume_id?: string
          file_url?: string
          format?: 'pdf' | 'docx'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_plan: 'free' | 'premium' | 'pro' | 'white_label'
      resume_status: 'uploaded' | 'parsed' | 'rewritten' | 'exported'
      export_format: 'pdf' | 'docx'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Additional types for the application
export interface RoleColorProfile {
  builder: number
  enabler: number
  thriver: number
  supportee: number
  assessment_date: string
  assessment_id: string
}

export interface ParsedResume {
  personal_info: {
    name: string
    email: string
    phone?: string
    location?: string
    linkedin?: string
    website?: string
  }
  summary?: string
  experience: Array<{
    title: string
    company: string
    location?: string
    start_date: string
    end_date?: string
    description: string[]
  }>
  education: Array<{
    degree: string
    institution: string
    location?: string
    graduation_date?: string
    gpa?: string
  }>
  skills: string[]
  certifications?: Array<{
    name: string
    issuer: string
    date?: string
  }>
  projects?: Array<{
    name: string
    description: string
    technologies?: string[]
    url?: string
  }>
}

export interface RewrittenResume extends ParsedResume {
  rolecolor_emphasis: {
    primary_color: 'builder' | 'enabler' | 'thriver' | 'supportee'
    highlighted_traits: string[]
    rewritten_sections: string[]
  }
}
