import { supabase } from "@/lib/superbaseServer";

export async function createSignedUrl(path: string) {
  const { data, error } = await supabase.storage
    .from("kyc-documents")
    .createSignedUrl(path, 60 * 60);

  if (error) throw error;

  return data.signedUrl;
}