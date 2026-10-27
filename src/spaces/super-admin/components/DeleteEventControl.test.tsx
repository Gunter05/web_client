import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import messages from "@/shared/i18n/messages/fr.json";
import { DeleteEventControl } from "@/spaces/super-admin/components/DeleteEventControl";

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

function renderControl(remove: () => Promise<{ error?: string }>) {
  render(
    <NextIntlClientProvider locale="fr" messages={messages}>
      <DeleteEventControl name="Soirée de gala" remove={remove} />
    </NextIntlClientProvider>,
  );
}

describe("DeleteEventControl (ADR 0021 du backend)", () => {
  it("ne supprime qu'après une confirmation qui dit ce qui disparaît", async () => {
    const remove = vi.fn().mockResolvedValue({});
    renderControl(remove);

    fireEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(
      await screen.findByRole("alertdialog", {
        name: "Supprimer « Soirée de gala » ?",
      }),
    ).toHaveTextContent("irréversible");
    expect(remove).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", { name: "Supprimer définitivement" }),
    );
    await waitFor(() => expect(remove).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
  });

  it("garde la confirmation ouverte si l'API refuse", async () => {
    const { toast } = await import("sonner");
    renderControl(vi.fn().mockResolvedValue({ error: "accessDenied" }));

    fireEvent.click(screen.getByRole("button", { name: "Supprimer" }));
    fireEvent.click(
      await screen.findByRole("button", { name: "Supprimer définitivement" }),
    );
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Accès refusé"),
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });
});
