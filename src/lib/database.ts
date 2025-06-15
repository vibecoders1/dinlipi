import { supabase } from './supabase';
import type { DiaryEntry, Practice, PracticeEntry, MoodEntry, UserProfile } from './supabase';

export class DiaryService {
  // Moods
  static async getMoods() {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  // Diary Entries
  static async createDiaryEntry(entry: Omit<DiaryEntry, 'id' | 'created_at' | 'updated_at'> & { tags?: string[]; mood_id?: string }) {
    const { tags, ...diaryData } = entry;
    
    const { data: diaryEntry, error: diaryError } = await supabase
      .from('diary_entries')
      .insert([diaryData])
      .select()
      .single();
    
    if (diaryError) throw diaryError;
    
    // Handle tags if provided
    if (tags && tags.length > 0) {
      await this.addTagsToEntry(diaryEntry.id, entry.user_id, tags);
    }
    
    // Return the entry with tags
    return await this.getDiaryEntryById(diaryEntry.id);
  }

  static async addTagsToEntry(entryId: string, userId: string, tags: string[]) {
    // Create or get existing tags
    const tagPromises = tags.map(async (tagName) => {
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('user_id', userId)
        .eq('name', tagName)
        .single();
      
      if (existingTag) {
        return existingTag.id;
      }
      
      const { data: newTag, error } = await supabase
        .from('tags')
        .insert([{ user_id: userId, name: tagName }])
        .select('id')
        .single();
      
      if (error) throw error;
      return newTag.id;
    });
    
    const tagIds = await Promise.all(tagPromises);
    
    // Link tags to diary entry
    const linkData = tagIds.map(tagId => ({
      diary_entry_id: entryId,
      tag_id: tagId
    }));
    
    const { error } = await supabase
      .from('diary_entry_tags')
      .insert(linkData);
    
    if (error) throw error;
  }

  static async getDiaryEntries(userId: string, options?: {
    year?: number;
    month?: number;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('diary_entries')
      .select(`
        *,
        moods (
          id,
          name,
          emoji,
          color
        ),
        diary_entry_tags (
          tags (
            id,
            name
          )
        )
      `)
      .eq('user_id', userId);

    // Filter by year and month if provided
    if (options?.year !== undefined && options?.month !== undefined) {
      const startDate = new Date(options.year, options.month, 1);
      const endDate = new Date(options.year, options.month + 1, 0);
      
      query = query
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0]);
    }

    // Add pagination if provided
    if (options?.offset !== undefined && options?.limit) {
      query = query.range(options.offset, options.offset + options.limit - 1);
    } else if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) throw error;
    
    // Transform data to include tags array and mood
    return data?.map(entry => ({
      ...entry,
      tags: entry.diary_entry_tags?.map((det: any) => det.tags.name) || [],
      mood: entry.moods || null
    })) || [];
  }

  static async getDiaryEntryByDate(userId: string, date: string) {
    const { data, error } = await supabase
      .from('diary_entries')
      .select(`
        *,
        moods (
          id,
          name,
          emoji,
          color
        ),
        diary_entry_tags (
          tags (
            id,
            name
          )
        )
      `)
      .eq('user_id', userId)
      .eq('date', date)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) {
      return {
        ...data,
        tags: data.diary_entry_tags?.map((det: any) => det.tags.name) || [],
        mood: data.moods || null
      };
    }
    
    return data;
  }

  static async getDiaryEntryById(id: string) {
    const { data, error } = await supabase
      .from('diary_entries')
      .select(`
        *,
        moods (
          id,
          name,
          emoji,
          color
        ),
        diary_entry_tags (
          tags (
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) {
      return {
        ...data,
        tags: data.diary_entry_tags?.map((det: any) => det.tags.name) || [],
        mood: data.moods || null
      };
    }
    
    return data;
  }

  static async updateDiaryEntry(id: string, updates: Partial<DiaryEntry> & { tags?: string[]; mood_id?: string }) {
    const { tags, ...entryUpdates } = updates;
    
    // Update the main entry
    const { data, error } = await supabase
      .from('diary_entries')
      .update({ ...entryUpdates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Handle tag updates if provided
    if (tags !== undefined) {
      // First, delete existing tag links
      await supabase
        .from('diary_entry_tags')
        .delete()
        .eq('diary_entry_id', id);
      
      // Then add new tags
      if (tags.length > 0) {
        await this.addTagsToEntry(id, data.user_id, tags);
      }
    }
    
    // Return the updated entry with tags
    return await this.getDiaryEntryById(id);
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

  static async deletePractice(id: string) {
    const { error } = await supabase
      .from('practices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
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