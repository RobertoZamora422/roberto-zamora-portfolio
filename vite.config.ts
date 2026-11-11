import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  publicDir: false,
  define: {
    "process.env.PORTFOLIO_PREVIEW": JSON.stringify(process.env.PORTFOLIO_PREVIEW ?? "0"),
  },
});
