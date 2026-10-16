import { Coque } from "./_coque/coque";

export default function LayoutPublic({ children }: LayoutProps<"/">) {
  return <Coque>{children}</Coque>;
}
