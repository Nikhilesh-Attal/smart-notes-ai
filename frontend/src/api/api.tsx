// import { createClient } from "@supabase/supabase-js";

// export function createSupabaseClient() {
//   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
//   const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

//   if (!supabaseUrl || !supabaseKey) {
//     throw new Error("Supabase credentials are not configured");
//   }

//   return createClient(supabaseUrl, supabaseKey, {
//     global: {
//       fetch: (url, options = {}) => {
//         // Add timeout to prevent hanging requests
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
//         return fetch(url, {
//           ...options,
//           signal: controller.signal,
//         }).finally(() => {
//           clearTimeout(timeoutId);
//         });
//       },
//     },
//   });
// }


import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials are not configured");
  }

  // Returning the default client to test if the custom fetch was causing the 500
  return createClient(supabaseUrl, supabaseKey);
}