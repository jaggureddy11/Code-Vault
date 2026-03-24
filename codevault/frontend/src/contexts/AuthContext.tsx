import { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getApiBaseUrl } from '@/lib/utils';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: (SupabaseUser | FirebaseUser) & { id: string } | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(SupabaseUser | FirebaseUser) & { id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Manage Supabase Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ ...session.user, id: session.user.id });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ ...session.user, id: session.user.id });
      } else if (!auth.currentUser) {
        setUser(null);
      }
    });

    // 2. Manage Firebase Auth State
    const unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map uid to id for compatibility with existing code
        setUser({ ...firebaseUser, id: firebaseUser.uid } as any);
      } else {
        // Only clear if Supabase also doesn't have a user
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!session?.user) {
            setUser(null);
          }
        });
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      unsubscribeFirebase();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

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
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Firebase Google Auth Error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    // Sign out from both services
    await Promise.all([
      supabase.auth.signOut(),
      firebaseSignOut(auth)
    ]);

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
