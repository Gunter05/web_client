import { AuthPage, RegisterView } from "@/spaces/auth";

export default function Page({ searchParams }: PageProps<"/register">) {
  return (
    <AuthPage>
      <RegisterView searchParams={searchParams} />
    </AuthPage>
  );
}
