const DEFAULT_ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf"
  ]
  
  export function validateFile(
    file: File,
    options?: {
      allowedTypes?: string[]
      maxSizeMB?: number
    }
  ) {
    const allowedTypes = options?.allowedTypes ?? DEFAULT_ALLOWED_TYPES
    const maxSize = (options?.maxSizeMB ?? 5) * 1024 * 1024
  
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPG, PNG, PDF allowed.");
    }
  
    if (file.size > maxSize) {
      throw new Error(`File too large. Max ${options?.maxSizeMB ?? 5}MB`)
    }
  }

  export function createSafeFileName(file: File) {
    
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "application/pdf": "pdf"
    }
  
    const ext = mimeToExt[file.type] || ""
  
    const cleaned = file.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.-]/g, "")
  
    const base = cleaned.includes(".")
      ? cleaned.slice(0, cleaned.lastIndexOf("."))
      : cleaned
  
    const timestamp = Date.now()
  
    return ext
      ? `${base}-${timestamp}.${ext}`
      : `${base}-${timestamp}`
  }