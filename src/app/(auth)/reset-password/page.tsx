import { AuthPage, ResetPasswordView } from "@/spaces/auth";

export default function Page({ searchParams }: PageProps<"/reset-password">) {
  return (
    <AuthPage>
      <ResetPasswordView searchParams={searchParams} />
    </AuthPage>
  );
}
