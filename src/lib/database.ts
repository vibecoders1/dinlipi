import { supabase } from './supabase';
import type { DiaryEntry, Practice, PracticeEntry, MoodEntry, UserProfile } from './supabase';

export class DiaryService {
  // Diary Entries
  static async createDiaryEntry(entry: Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('diary_entries')
      .insert([entry])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getDiaryEntries(userId: string) {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getDiaryEntryByDate(userId: string, date: string) {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateDiaryEntry(id: string, updates: Partial<DiaryEntry>) {
    const { data, error } = await supabase
      .from('diary_entries')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteDiaryEntry(id: string) {
    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Practices
  static async createPractice(practice: Omit<Practice, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('practices')
      .insert([practice])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getPractices(userId: string) {
    const { data, error } = await supabase
      .from('practices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async updatePractice(id: string, updates: Partial<Practice>) {
    const { data, error } = await supabase
      .from('practices')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Practice Entries
  static async createPracticeEntry(entry: Omit<PracticeEntry, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('practice_entries')
      .insert([entry])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getPracticeEntries(userId: string, practiceId: string) {
    const { data, error } = await supabase
      .from('practice_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('practice_id', practiceId)
      .order('day_number', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async completePracticeEntry(id: string) {
    const { data, error } = await supabase
      .from('practice_entries')
      .update({ 
        completed: true, 
        completed_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Mood Entries
  static async createMoodEntry(entry: Omit<MoodEntry, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('mood_entries')
      .insert([entry])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getMoodEntries(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId);
    
    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getMoodEntryByDate(userId: string, date: string) {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // User Profile
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}