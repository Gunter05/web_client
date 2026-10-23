import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, buttonVariants } from "@/shared/components/Button";
import { cn } from "@/shared/lib/utils";
import { buttonVariants as uiButtonVariants } from "@/shared/ui/button";

describe("Button du relooking", () => {
  // Mêmes classes que le bouton shadcn, qui les fusionne lui aussi avec cn().
  it("laisse les variantes shadcn inchangées", () => {
    expect(buttonVariants({ variant: "outline", size: "lg" })).toBe(
      cn(uiButtonVariants({ variant: "outline", size: "lg" })),
    );
    expect(buttonVariants()).toBe(cn(uiButtonVariants()));
  });

  it("rend l'action principale en rouge plein, capsule de 44 px", () => {
    render(
      <Button variant="primary" size="pill">
        Publier
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Publier" });
    expect(button).toHaveClass(
      "bg-ct-red",
      "text-white",
      "rounded-full",
      "h-11",
    );
    expect(button).not.toHaveClass("bg-primary", "rounded-lg", "h-8");
  });

  it("réserve le verre au cercle posé sur une photo", () => {
    expect(buttonVariants({ variant: "glass-circle" })).toContain("ct-glass");
    for (const variant of ["primary", "secondary", "surface", "ink"] as const)
      expect(buttonVariants({ variant })).not.toContain("ct-glass");
  });
});
