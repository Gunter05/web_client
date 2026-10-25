import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { RouteModal } from "@/shared/components/RouteModal";
import { NewEventView } from "@/spaces/user";

/** /events/new ouvert depuis l'application sur ordinateur : en modal. */
async function NewEvent({ searchParams }: PageProps<"/events/new">) {
  const { page } = await searchParams;
  return <NewEventView slug={typeof page === "string" ? page : null} inModal />;
}

export default async function Page(props: PageProps<"/events/new">) {
  const t = await getTranslations("events");
  return (
    <Suspense fallback={null}>
      <RouteModal path="/events/new" size="form" label={t("create")}>
        <NewEvent {...props} />
      </RouteModal>
    </Suspense>
  );
}
