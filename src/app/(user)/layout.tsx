import { UserLayout } from "@/spaces/user";

export default function Layout({ children }: LayoutProps<"/">) {
  return <UserLayout>{children}</UserLayout>;
}
