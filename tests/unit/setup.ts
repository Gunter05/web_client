import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// server-only plante hors de Next.js : on le neutralise dans les tests.
vi.mock("server-only", () => ({}));

// Variable obligatoire de clientEnv, lu par les composants (photos).
process.env.NEXT_PUBLIC_SITE_URL ??= "http://localhost:3000";

afterEach(() => {
  cleanup();
});
