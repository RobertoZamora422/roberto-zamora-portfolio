import { rename, rm } from "node:fs/promises";
import { resolve } from "node:path";
import type { Config } from "@react-router/dev/config";
import { caseFixture, projectFixture } from "./app/pruebas/datos";

const preview = process.env.PORTFOLIO_PREVIEW === "1";

export default {
  ssr: false,
  buildDirectory: preview ? ".local/prerender" : "build",
  routeDiscovery: { mode: "initial" },
  prerender: ({ getStaticPaths }) => [
    ...getStaticPaths(),
    ...(preview ? [projectFixture.path, caseFixture.path] : []),
  ],
  async buildEnd({ reactRouterConfig, viteConfig }) {
    const client = resolve(viteConfig.root, reactRouterConfig.buildDirectory, "client");
    // Pages reads this file for unmatched URLs and sends the HTTP status.
    await rename(resolve(client, "404/index.html"), resolve(client, "404.html"));
    await rm(resolve(client, "__spa-fallback.html"), { force: true });
  },
} satisfies Config;
