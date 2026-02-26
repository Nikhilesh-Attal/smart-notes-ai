<<<<<<< HEAD
//here we declare supabase related code.

=======
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials are not configured");
  }

  return createClient(supabaseUrl, supabaseKey);
<<<<<<< HEAD
}
=======
}
>>>>>>> 93fe1ef398e2d753a267bb1a0b001e4b4daf0f27
