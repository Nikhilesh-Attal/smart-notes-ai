//here we declare supabase related code.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials are not configured");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth:{
      persistSession: true, //tell supabase to save the session
      autoRefreshToken: true, //automatically refresh the session when it expires
      storage: window.localStorage, //use localStorage to store the session
    }
})
export function createSupabaseClient() {

  return supabase;
}