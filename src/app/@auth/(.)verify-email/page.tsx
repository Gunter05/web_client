import { AuthModal, VerifyEmailView } from "@/spaces/auth";

/** /verify-email ouvert depuis l'application : modal (plein écran sur mobile). */
export default function Page({ searchParams }: PageProps<"/verify-email">) {
  return (
    <AuthModal path="/verify-email">
      <VerifyEmailView searchParams={searchParams} />
    </AuthModal>
  );
}
