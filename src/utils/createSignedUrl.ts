import { supabase } from "@/lib/superbaseServer";

export async function createSignedUrl(path: string, bucket: string) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60);

  if (error) throw error;

  return data.signedUrl;
}