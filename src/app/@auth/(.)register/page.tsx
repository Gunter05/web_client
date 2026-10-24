import { AuthModal, RegisterView } from "@/spaces/auth";

/** /register ouvert depuis l'application : modal (plein écran sur mobile). */
export default function Page({ searchParams }: PageProps<"/register">) {
  return (
    <AuthModal>
      <RegisterView searchParams={searchParams} />
    </AuthModal>
  );
}
