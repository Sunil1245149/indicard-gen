
import { createClient, User as SupabaseUser } from '@supabase/supabase-js';
import { IdCardData } from "../types";

// Helper to safely get env vars in Vite or standard env
const getEnvVar = (key: string, viteKey: string) => {
  // Check process.env (Standard Node/Webpack)
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  // Check import.meta.env (Vite)
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    // @ts-ignore
    return import.meta.env[viteKey];
  }
  return '';
};

// Initialize Supabase Client
const supabaseUrl = getEnvVar('SUPABASE_URL', 'VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

// Prevent crash if keys are missing by using a placeholder.
// This allows the app to load so users can access "Demo Mode" even without Supabase config.
const clientUrl = supabaseUrl || 'https://placeholder.supabase.co';
const clientKey = supabaseKey || 'placeholder';

export const supabase = createClient(clientUrl, clientKey);

export type { SupabaseUser as User };

/**
 * Login with Google OAuth
 */
export const loginWithGoogle = async () => {
  if (!supabaseUrl) {
    console.warn("Supabase URL is missing. Login disabled.");
    throw new Error("Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // Returns to app after login
    },
  });
  if (error) throw error;
  return data;
};

/**
 * Logout
 */
export const logoutUser = async () => {
  if (!supabaseUrl) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Save Card Data to 'profiles' table in Supabase
 * @param userId - The ID of the authenticated user
 * @param cardData - The JSON data of the ID card
 * @returns The UUID of the inserted record
 */
export const saveCardToProfile = async (userId: string, cardData: IdCardData): Promise<string> => {
  if (!supabaseUrl) throw new Error("Supabase not configured");

  // We don't save the 'id' field itself into the json 'data' column usually, 
  // but we return the generated ID.
  const { data: insertedData, error } = await supabase
    .from('profiles')
    .insert([
      { 
        user_id: userId, 
        data: cardData,
        created_at: new Date().toISOString()
      }
    ])
    .select('id')
    .single();

  if (error) {
    console.error("Supabase Save Error:", error);
    throw new Error(error.message);
  }

  return insertedData.id;
};

/**
 * Fetch all cards for a specific user
 */
export const getUserCards = async (userId: string): Promise<IdCardData[]> => {
  if (!supabaseUrl) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('id, data')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Fetch Error:", error);
    return [];
  }

  // Map backend structure to frontend structure, injecting the UUID
  return data.map((row: any) => ({
    ...row.data,
    id: row.id
  }));
};

/**
 * Fetch a single card by ID (Public Read)
 * Used for the Scanner/Public View functionality
 */
export const getCardById = async (cardId: string): Promise<IdCardData | null> => {
  if (!supabaseUrl) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, data')
    .eq('id', cardId)
    .single();

  if (error) {
    console.error("Fetch Card Error:", error);
    return null;
  }

  return {
    ...data.data,
    id: data.id
  };
};

/**
 * Subscribe to Auth Changes
 */
export const subscribeToAuth = (callback: (user: SupabaseUser | null) => void) => {
  if (!supabaseUrl) {
    callback(null);
    return () => {};
  }

  // Check initial session
  supabase.auth.getSession().then(({ data: { session } }) => {
    callback(session?.user ?? null);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
};
