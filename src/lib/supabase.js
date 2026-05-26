import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_Publishable_key } from "./config";

export const supabase = createClient(SUPABASE_URL, SUPABASE_Publishable_key);
