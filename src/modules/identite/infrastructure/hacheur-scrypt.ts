import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { Hacheur } from "../application/ports";

export const hacheurScrypt: Hacheur = {
  hacher(motDePasse) {
    const sel = randomBytes(16).toString("hex");
    return `${sel}:${scryptSync(motDePasse, sel, 32).toString("hex")}`;
  },
  verifier(motDePasse, hash) {
    const [sel, attendu] = hash.split(":");
    if (!sel || !attendu) return false;
    const calcule = scryptSync(motDePasse, sel, 32);
    return timingSafeEqual(calcule, Buffer.from(attendu, "hex"));
  },
};
