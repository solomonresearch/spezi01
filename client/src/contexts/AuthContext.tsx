import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  name: string;
  username: string;
  university_code: string;
  university_category: string;
  university_name: string;
}

export type UserRole = 'user' | 'moderator' | 'admin';

interface DBUserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  is_admin: boolean;
  role: UserRole;
  university_code?: string;
  university_category?: string;
  university_name?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: DBUserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, profile: UserProfile) => Promise<{ error: AuthError | Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DBUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = async (userId: string): Promise<DBUserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, name, username, is_admin, role, university_code, university_category, university_name, created_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      // Ensure role field exists (fallback for users before migration)
      const profile = data as DBUserProfile;
      if (!profile.role) {
        profile.role = profile.is_admin ? 'admin' : 'user';
      }

      return profile;
    } catch (error) {
      console.error('Exception while fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Fetch profile in background (non-blocking)
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
      }
    }).catch((error) => {
      console.error('Error getting initial session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch profile in background (non-blocking)
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, profile: UserProfile) => {
    try {
      // First, create the auth user
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return { error: authError };
      }

      if (!data.user) {
        return { error: new Error('User creation failed') };
      }

      // Then, create the user profile using secure function that bypasses RLS
      const { error: profileError } = await supabase.rpc('create_user_profile', {
        p_id: data.user.id,
        p_email: email,
        p_name: profile.name,
        p_username: profile.username,
        p_university_code: profile.university_code,
        p_university_category: profile.university_category,
        p_university_name: profile.university_name,
      });

      if (profileError) {
        // If profile creation fails, we should ideally delete the auth user
        // but for now, just return the error
        console.error('Profile creation error:', profileError);
        return { error: new Error('Failed to create user profile: ' + profileError.message) };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
