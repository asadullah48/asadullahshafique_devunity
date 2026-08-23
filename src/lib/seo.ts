/**
 * Shared SEO constants.
 *
 * PERSON_ID lived in src/app/layout.tsx until Next rejected it: layouts may
 * only export a fixed set of names (`default`, `metadata`, `revalidate`,
 * `dynamic`, ...), and anything else fails the build with
 *
 *   Type 'string' is not assignable to type 'never'
 *
 * from the generated .next/types check. Route files are not modules to import
 * from — shared values belong here.
 */

export const BASE_URL = "https://asadullahshafique-devunity.vercel.app";

/**
 * The stable schema.org identity for Asadullah, shared by every page and
 * language. Localized pages REFERENCE this @id rather than declaring their own
 * Person node, so one human never appears as two entities that disagree.
 */
export const PERSON_ID = `${BASE_URL}/#person`;
