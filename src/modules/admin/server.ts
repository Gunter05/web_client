import "server-only";
import { administrationApi } from "@/modules/admin/infrastructure/admin.api";

export { getCurrentAdmin } from "@/modules/admin/infrastructure/admin-guard";

export type {
  AdminAccount,
  AdminPageDetails,
  AdminEvent,
  AdminMember,
  AdminPage,
} from "@/modules/admin/domain/admin.types";

/** Supervision (US-07) : le rôle admin est vérifié par l'API à chaque appel. */
export const listAccounts = administrationApi.accounts;
export const listPages = administrationApi.pages;
export const getPageDetails = administrationApi.pageDetails;
export const listEvents = administrationApi.events;
