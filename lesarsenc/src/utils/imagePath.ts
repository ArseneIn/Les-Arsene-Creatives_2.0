export const getImagePath = (path: string | undefined | null) => {
    if (!path) return "";

    // If it's already an external URL (Google, Unsplash, etc.), leave it alone
    if (path.startsWith("http")) return path;

    // Remove leading slash to make it easier to handle
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // PRODUCTION FIX: 
    // If we are running on the live server in the 'website_0ae36c9d' folder,
    // we need to prepend that folder name correctly.
    // However, since we can't easily detect folder name from static JS without config,
    // we will stick to a known structure or relative pathing.

    // Best Approach for now: 
    // If the path is in 'uploads/', it should be accessible relative to the domain root
    // IF the base path is set.

    // TEMPORARY MANUAL FIX FOR USER'S SUBDIRECTORY:
    // If we are on localhost, look for root.
    // If we are on prod, we might need the prefix.

    // But wait, if we use standard <img> tag, "/uploads/..." implies domain root.
    // "./uploads/..." implies relative to current page.

    // Let's rely on an environment variable or a constant we set here.
    const BASE_PATH = process.env.NODE_ENV === 'production' ? "/website_0ae36c9d" : "";

    return `${BASE_PATH}/${cleanPath}`;
};
