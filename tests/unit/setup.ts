import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// server-only plante hors de Next.js : on le neutralise dans les tests.
vi.mock("server-only", () => ({}));

afterEach(() => {
  cleanup();
});
