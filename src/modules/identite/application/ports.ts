import type { Compte } from "../domain/compte";

export type DepotComptes = {
  parId(id: string): Compte | undefined;
  parEmail(email: string): Compte | undefined;
  tous(): Compte[];
  ajouter(compte: Compte): void;
  modifier(compte: Compte): void;
};

export type Session = {
  token: string;
  compteId: string;
  pageActiveId: string | null;
  creeLe: string;
};

export type DepotSessions = {
  parToken(token: string): Session | undefined;
  ajouter(session: Session): void;
  modifier(session: Session): void;
  supprimer(token: string): void;
};

export type Hacheur = {
  hacher(motDePasse: string): string;
  verifier(motDePasse: string, hash: string): boolean;
};
