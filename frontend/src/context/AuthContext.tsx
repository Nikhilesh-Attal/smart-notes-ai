import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { createSupabaseClient } from "../api/api";
import type { Session } from "@supabase/supabase-js";

const supabase = createSupabaseClient();

/** =====================
 * Types
 * ===================== */
type Credentials = {
  email: string;
  password: string;
  fullName?: string;
};

type AuthResponse = {
  success: boolean;
  data?: any;
  error?: any;
};

type AuthContextType = {
  session: Session | null;
  signUpNewUser: (params: Credentials) => Promise<AuthResponse>;
  signInUser: (params: Credentials) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

/** =====================
 * Provider
 * ===================== */
export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);

  /** -------- SIGNUP -------- */
  const signUpNewUser = async ({ email, password, fullName }: Credentials): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName, // This tells Supabase to save the name in user metadata
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        return { success: false, error };
      }

      setSession(data.session ?? null);
      return { success: true, data };
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.name === 'AbortError') {
        return { success: false, error: { message: 'Connection timeout. Please check your internet connection and try again.' } };
      }
      return { success: false, error: { message: 'Failed to connect to authentication service.' } };
    }
  };

  /** -------- SIGNIN -------- */
  const signInUser = async ({ email, password }: Credentials): Promise<AuthResponse> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      clearTimeout(timeoutId);

      if (error) {
        console.error("Signin error:", error);
        return { success: false, error };
      }

      setSession(data.session ?? null);
      return { success: true, data };
    } catch (err: any) {
      console.error("Signin error:", err);
      if (err.name === 'AbortError') {
        return { success: false, error: { message: 'Connection timeout. Please check your internet connection and try again.' } };
      }
      return { success: false, error: { message: 'Failed to connect to authentication service.' } };
    }
  };

  /** -------- SIGNOUT -------- */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Signout error:", error);
    }
    setSession(null);
  };

  /** -------- SESSION RESTORE -------- */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        signUpNewUser,
        signInUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/** =====================
 * Hook
 * ===================== */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthContextProvider");
  }
  return context;
};