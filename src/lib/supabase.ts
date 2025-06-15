import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rkazgwdjamqlqvkpjizc.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrYXpnd2RqYW1xbHF2a3BqaXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjQ2OTUsImV4cCI6MjA2NTUwMDY5NX0.GPt5uFuGjp5c1HuvfXzoZXRyHCuPzuKklOCQH4s1J3I"

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database Types
export interface DiaryEntry {
  id: string
  user_id: string
  title: string
  content: string
  date: string
  mood_rating?: number
  photo_url?: string
  created_at: string
  updated_at: string
}

export interface Practice {
  id: string
  user_id: string
  practice_type: 'photo' | 'drawing' | 'writing' | 'music' | 'daily_creation'
  title: string
  content?: string
  media_url?: string
  created_at: string
  updated_at: string
}

export interface PracticeEntry {
  id: string
  user_id: string
  practice_id: string
  day_number: number
  content: string
  completed: boolean
  completed_at?: string
  created_at: string
}

export interface MoodEntry {
  id: string
  user_id: string
  date: string
  mood_rating: number
  emotions: string[]
  notes?: string
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  preferred_language: string
  theme: 'light' | 'dark'
  font_size: 'small' | 'medium' | 'large'
  created_at: string
  updated_at: string
}