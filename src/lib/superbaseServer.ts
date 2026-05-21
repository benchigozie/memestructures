import { createClient } from "@supabase/supabase-js"

console.log("URL:",process.env.SUPABASE_URL);
console.log("KEY exists:", process.env.SUPABASE_SECRET_KEY);

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)