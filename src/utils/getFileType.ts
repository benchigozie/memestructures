export const getFileType = (url: string) => {
    if (!url) return "unknown";

    
    if (url.includes(".pdf")) return "pdf";
    return "image";
};