import "server-only";
import { collection } from "@/shared/stockage/collection-json";
import type { Compte } from "../domain/compte";
import type {
  DepotComptes,
  DepotSessions,
  Session,
} from "../application/ports";
import { comptesDemo } from "./comptes-demo";

const comptes = collection<Compte>("comptes", comptesDemo);
const sessions = collection<Session>("sessions", () => []);

export const depotComptesJson: DepotComptes = {
  parId: (id) => comptes.tous().find((c) => c.id === id),
  parEmail: (email) => comptes.tous().find((c) => c.email === email),
  tous: () => comptes.tous(),
  ajouter: (compte) => comptes.muter((l) => [...l, compte]),
  modifier: (compte) =>
    comptes.muter((l) => l.map((c) => (c.id === compte.id ? compte : c))),
};

export const depotSessionsJson: DepotSessions = {
  parToken: (token) => sessions.tous().find((s) => s.token === token),
  ajouter: (session) => sessions.muter((l) => [...l, session]),
  modifier: (session) =>
    sessions.muter((l) =>
      l.map((s) => (s.token === session.token ? session : s)),
    ),
  supprimer: (token) =>
    sessions.muter((l) => l.filter((s) => s.token !== token)),
};
