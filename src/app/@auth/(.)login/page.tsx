import { AuthModal, LoginView } from "@/spaces/auth";

/** /login ouvert depuis l'application : modal (plein écran sur mobile). */
export default function Page({ searchParams }: PageProps<"/login">) {
  return (
    <AuthModal>
      <LoginView searchParams={searchParams} />
    </AuthModal>
  );
}
