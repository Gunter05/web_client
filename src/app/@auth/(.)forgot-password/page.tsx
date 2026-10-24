import { AuthModal, ForgotPasswordView } from "@/spaces/auth";

/** /forgot-password ouvert depuis l'application : modal (plein écran sur mobile). */
export default function Page() {
  return (
    <AuthModal>
      <ForgotPasswordView />
    </AuthModal>
  );
}
