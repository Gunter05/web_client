import "server-only";
import { serverSchema, validate } from "@/shared/config/schema";

export const env = validate(serverSchema, process.env);
