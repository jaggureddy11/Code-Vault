import { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getApiBaseUrl } from '@/lib/utils';

// We now purely use SupabaseUser to guarantee strict data syncing across all auth methods
interface AuthContextType {
  user: SupabaseUser & { id: string } | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser & { id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Single Source of Truth: Manage Supabase Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ ...session.user, id: session.user.id });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ ...session.user, id: session.user.id });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const textResponse = await res.text().catch(() => '');
      console.error('Non-JSON response received from /api/auth/signup:', textResponse);
      throw new Error(`Backend API is unreachable or returned invalid format. Please verify your connection or VITE_API_URL settings. (Status: ${res.status})`);
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sign up');
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) throw signInError;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) {
      console.error("Supabase Google Auth Error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    
    // Clear all cached queries to prevent data leaking between users
    const queryClient = (window as any).queryClient;
    if (queryClient) {
      queryClient.clear();
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
