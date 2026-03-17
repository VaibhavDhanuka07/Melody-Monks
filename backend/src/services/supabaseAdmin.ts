import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

let supabaseAdmin: SupabaseClient | null = null;

export const getSupabaseAdmin = () => {
  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseAdmin;
};

export const isSupabaseAdminConfigured = () =>
  Boolean(supabaseUrl && serviceRoleKey);
