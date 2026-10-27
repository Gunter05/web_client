import { AuthPage, LoginView } from "@/spaces/auth";

export default function Page({ searchParams }: PageProps<"/login">) {
  return (
    <AuthPage>
      <LoginView searchParams={searchParams} />
    </AuthPage>
  );
}
