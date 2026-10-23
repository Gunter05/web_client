import "server-only";

/**
 * Entrée serveur du module `medias` : ce que les Server Actions des autres
 * modules utilisent. Hors de `index.ts`, pour que Zod ne parte pas dans le
 * code du navigateur.
 */
export { photoUrlField } from "@/modules/medias/application/photo-url-field";
