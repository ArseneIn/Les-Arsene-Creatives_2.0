export const getImagePath = (path: string | undefined | null) => {
    if (!path) return "";

    // If it's already an external URL (Google, Unsplash, etc.), leave it alone
    if (path.startsWith("http")) return path;

    // Remove leading slash to make it easier to handle
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // Simplified Path Handling for Production
    // Since the API and frontend are deployed to the same domain root or consistent folder structure,
    // we should rely on relative paths or root-absolute paths without hardcoded subdirectories.

    // If the path starts with "uploads/", it means it's in the uploads folder.
    // In production (Bluehost), if the 'uploads' folder is at the root (public_html/uploads),
    // then "/uploads/..." is the correct path.

    return `/${cleanPath}`;
};
