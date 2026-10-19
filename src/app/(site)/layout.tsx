import { Coque } from "@/widgets/site-shell/Coque";

export default function LayoutPublic({ children }: LayoutProps<"/">) {
  return <Coque>{children}</Coque>;
}
