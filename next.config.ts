import type { NextConfig } from "next";
import { clientSchema, serverSchema, valider } from "@/shared/config/schema";

valider(serverSchema, process.env);
valider(clientSchema, process.env);

const nextConfig: NextConfig = {/* config options here */};

export default nextConfig;
