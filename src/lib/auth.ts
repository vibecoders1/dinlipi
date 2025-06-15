import { supabase } from './supabase';

export class AuthService {
  // Sign up with email and password
  static async signUp(email: string, password: string, metadata?: { full_name?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    return data;
  }

  // Sign in with email and password
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }

  // Sign out
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    // Ignore "session not found" errors as user is already logged out
    if (error && error.message !== 'Session not found') {
      throw error;
    }
  }

  // Invalidate all sessions and clear storage
  static async invalidateAllSessions() {
    try {
      // Sign out globally to invalidate all sessions
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      // Continue even if this fails
    }

    // Clear all auth-related data from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });

    // Clear from sessionStorage if it exists
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    }
  }

  // Get current session
  static async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  // Get current user
  static async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  // Reset password
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
  }

  // Update password
  static async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    if (error) throw error;
    return data;
  }

  // Listen to auth changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Sign in with Google OAuth
  static async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) throw error;
    return data;
  }
}