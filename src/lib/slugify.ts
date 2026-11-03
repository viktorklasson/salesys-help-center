/** Readable id for linking to a section, e.g. "Börja här" -> "borja-har", "GET /api/users" -> "get-api-users" */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // å/ä -> a, ö -> o, é -> e
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** The id of an endpoint on its API page, e.g. "get-api-dial-calls-v1" */
export const endpointAnchor = (method: string, path: string) => slugify(`${method} ${path}`);
