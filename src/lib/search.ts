/** Lowercase, single spaces: how search text and queries are compared (e.g. the FAQ search) */
export const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, ' ').trim();
