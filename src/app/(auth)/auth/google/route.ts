import type { NextRequest } from "next/server";
import { startGoogleSignIn } from "@/modules/authentication/application/google-sign-in";

/** « Continuer avec Google » : part chez Google (ADR 0019 du backend). */
export function GET(request: NextRequest) {
  return startGoogleSignIn(request);
}
