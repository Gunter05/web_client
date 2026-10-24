import type { NextRequest } from "next/server";
import { finishGoogleSignIn } from "@/modules/authentication/application/google-sign-in";

/** Retour de Google : ouvre la session, puis revient à la page demandée. */
export function GET(request: NextRequest) {
  return finishGoogleSignIn(request);
}
