import { supabase } from "@/lib/superbaseServer"
import { createSafeFileName } from "./validateFile"

export async function uploadKYCFile(file: File, folder: string) {
  const fileName = createSafeFileName(file)

  const filePath = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from("kyc-documents")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    })

  if (error) throw error

    return filePath
}

export async function uploadTransactionFile(file: File, folder: string) {
  const fileName = createSafeFileName(file)

  const filePath = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from("transactions")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    })

  if (error) throw error

    return filePath
}

export async function uploadSupportFile(file: File, folder: string) {
  const fileName = createSafeFileName(file)

  const filePath = `${folder}/${fileName}`

  const { error } = await supabase.storage
    .from("support-attachments")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    })

  if (error) throw error

    return filePath
}

export async function uploadProfileImage(
  file: File,
  folder: string
) {
  const fileName = createSafeFileName(file);

  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
      });

  if (error) throw error;

  return filePath;
}