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