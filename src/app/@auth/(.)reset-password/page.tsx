import { AuthModal, ResetPasswordView } from "@/spaces/auth";

/** /reset-password ouvert depuis l'application : modal (plein écran sur mobile). */
export default function Page({ searchParams }: PageProps<"/reset-password">) {
  return (
    <AuthModal>
      <ResetPasswordView searchParams={searchParams} />
    </AuthModal>
  );
}
