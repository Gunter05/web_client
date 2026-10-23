import { PushSync } from "@/modules/notifications";
import {
  registerPushDeviceAction,
  unregisterPushDeviceAction,
} from "@/modules/notifications/application/notifications.actions";
import { getCurrentAccount } from "@/modules/authentication/server";

const pushActions = {
  register: registerPushDeviceAction,
  unregister: unregisterPushDeviceAction,
};

/** Réenregistre l'appareil pour les push, seulement pour une personne connectée. */
export async function PushSyncForAccount() {
  if (!(await getCurrentAccount())) return null;
  return <PushSync actions={pushActions} />;
}
