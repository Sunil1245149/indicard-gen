
import { createClient } from '@supabase/supabase-js';
import { IdCardData, INITIAL_ID_DATA } from "../types";

// Helper to safely get env vars
const getEnvVar = (key: string, viteKey: string) => {
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
    // @ts-ignore
    return import.meta.env[viteKey];
  }
  return '';
};

// --- CONFIGURATION ---
const DEFAULT_URL = 'https://joargviiuhdnlrfcpvla.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvYXJndmlpdWhkbmxyZmNwdmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NDY2NDAsImV4cCI6MjA4MjIyMjY0MH0.t9DBx3C6CfpmUeFoW2RjHD_dVT5DhwFnSUc5GidDFQw';

const supabaseUrl = getEnvVar('SUPABASE_URL', 'VITE_SUPABASE_URL') || DEFAULT_URL;
const supabaseKey = getEnvVar('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY') || DEFAULT_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
);

// --- LOCAL STORAGE FALLBACK KEY ---
const LOCAL_STORAGE_KEY = 'kisan_id_pro_cards';

export const isConfigValid = () => {
  return supabaseKey && supabaseKey.length > 20 && supabaseKey.startsWith('ey');
};

// --- HELPER FUNCTIONS FOR LOCAL STORAGE ---
const saveToLocal = (cardData: IdCardData): string => {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const newId = crypto.randomUUID ? crypto.randomUUID() : 'local-' + Date.now();
    const newRecord = {
      id: newId,
      data: { ...cardData, id: newId },
      created_at: new Date().toISOString()
    };
    existing.push(newRecord);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
    return newId;
  } catch (e) {
    console.error("Local Storage Error:", e);
    throw new Error("Failed to save locally");
  }
};

const getByIdLocal = (cardId: string): IdCardData | null => {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const found = existing.find((item: any) => item.id === cardId);
    return found ? found.data : null;
  } catch (e) {
    return null;
  }
};

const getAllLocal = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
};

// --- ERROR HANDLING ---
const logSupabaseError = (error: any, context: string) => {
  const msg = error.message || JSON.stringify(error);
  // Check for table missing error (PostgREST 404 or Postgres 42P01)
  if (msg.includes('Could not find the table') || error.code === '42P01') {
    console.warn(`[${context}] Table 'cards' missing in Supabase. Using Local Storage.`);
  } else {
    console.error(`[${context}] Supabase Error:`, msg);
  }
};

/**
 * PUBLIC SAVE: Saves a card. Falls back to local if DB fails.
 * Uses 'cards' table.
 * Maps IdCardData to flat columns: former_id, name, mobile, address, photo_url, notes.
 */
export const savePublicCard = async (cardData: IdCardData): Promise<string> => {
  // If config is missing, fallback to local immediately
  if (!isConfigValid()) {
    console.warn("Config invalid, using local storage");
    return saveToLocal(cardData);
  }

  // Prepare payload for 'cards' table
  const dbPayload = {
    former_id: cardData.idNumber,
    name: cardData.name,
    mobile: cardData.phone,
    address: cardData.address,
    photo_url: cardData.photoUrl,
    notes: JSON.stringify(cardData), // Persist full state in notes
    created_at: new Date().toISOString()
  };

  const { data: insertedData, error } = await supabase
    .from('cards')
    .insert([dbPayload])
    .select('id')
    .single();

  if (error) {
    logSupabaseError(error, "savePublicCard");
    return saveToLocal(cardData);
  }

  return insertedData.id;
};

/**
 * PUBLIC GET: Verify a card by ID
 */
export const getCardById = async (cardId: string): Promise<IdCardData | null> => {
  const localCard = getByIdLocal(cardId);
  if (localCard) return localCard;

  if (!isConfigValid()) return null;

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('id', cardId)
    .single();

  if (error || !data) {
    if (error) logSupabaseError(error, "getCardById");
    return null;
  }

  // Reconstruct the full IdCardData from 'notes' JSON or fallback to columns
  let fullData: IdCardData = { ...INITIAL_ID_DATA };

  if (data.notes) {
    try {
      const parsed = JSON.parse(data.notes);
      fullData = { ...fullData, ...parsed };
    } catch (e) {
      // notes was not JSON, ignore
    }
  }

  // Ensure database source-of-truth fields overwrite the JSON (ID is critical)
  fullData.id = data.id;
  fullData.idNumber = data.former_id || fullData.idNumber;
  fullData.name = data.name || fullData.name;
  fullData.phone = data.mobile || fullData.phone;
  fullData.address = data.address || fullData.address;
  fullData.photoUrl = data.photo_url || fullData.photoUrl;

  return fullData;
};

/**
 * ADMIN: Get All Cards
 */
export const getAllCards = async (): Promise<any[]> => {
  if (!isConfigValid()) return getAllLocal();

  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    logSupabaseError(error, "getAllCards");
    return getAllLocal();
  }

  // Map the flat DB structure back to the shape expected by the UI ({ id, data: IdCardData, ... })
  return (data || []).map(row => {
    let cardData = { ...INITIAL_ID_DATA };
    
    if (row.notes) {
      try {
        const parsed = JSON.parse(row.notes);
        cardData = { ...cardData, ...parsed };
      } catch (e) {}
    }

    // Sync fields
    cardData.id = row.id;
    cardData.idNumber = row.former_id;
    cardData.name = row.name;
    cardData.phone = row.mobile;
    cardData.address = row.address;
    cardData.photoUrl = row.photo_url;

    return {
      id: row.id,
      created_at: row.created_at,
      data: cardData
    };
  });
};

/**
 * ADMIN: Delete Card
 */
export const deleteCard = async (id: string): Promise<boolean> => {
  // Try local delete first
  let localDeleted = false;
  try {
    const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const filtered = local.filter((item: any) => item.id !== id);
    if (local.length !== filtered.length) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      localDeleted = true;
    }
  } catch(e) {}

  if (!isConfigValid()) return localDeleted;

  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', id);

  if (error) {
    logSupabaseError(error, "deleteCard");
    return localDeleted; // Return true if at least local was deleted
  }
  return true;
};
