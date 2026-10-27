import { AuthPage, VerifyEmailView } from "@/spaces/auth";

export default function Page({ searchParams }: PageProps<"/verify-email">) {
  return (
    <AuthPage>
      <VerifyEmailView searchParams={searchParams} />
    </AuthPage>
  );
}
