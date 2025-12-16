import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const runnerDir = process.env.E2E_RUNNER_DIR ? path.resolve(process.env.E2E_RUNNER_DIR) : process.cwd();
const workspaceRoot = path.resolve(fileURLToPath(new URL("../../", import.meta.url)));
const muiSrc = path.resolve(fileURLToPath(new URL("../../sub/mui/src", import.meta.url)));
const muiHooksSrc = path.resolve(fileURLToPath(new URL("../../sub/mui/src/hooks", import.meta.url)));

const port = Number(process.env.E2E_PORT ?? 4173);
const outDir = process.env.E2E_OUT_DIR ?? "dist";

/**
 * The library sources in `sub/mui/src` often import sibling modules with a `.js` extension
 * (because the built output is `.js`). When we run E2E against source files via Vite,
 * we map `./foo.js` → `./foo.ts` or `./foo.tsx` if it exists.
 */
function resolveMuiJsToTs() {
  const marker = `${path.sep}sub${path.sep}mui${path.sep}src${path.sep}`;
  const stripFsPrefix = (p: string) => (p.startsWith("/@fs/") ? p.slice("/@fs/".length) : p);

  return {
    name: "resolve-mui-js-to-ts",
    enforce: "pre",
    resolveId(source: string, importer?: string) {
      if (!importer) return null;
      if (!source.endsWith(".js")) return null;

      const imp = stripFsPrefix(importer);
      if (!imp.includes(marker)) return null;

      const absJs = path.resolve(path.dirname(imp), source);
      const absTs = absJs.slice(0, -3) + ".ts";
      const absTsx = absJs.slice(0, -3) + ".tsx";

      if (fs.existsSync(absTs)) return absTs;
      if (fs.existsSync(absTsx)) return absTsx;
      return null;
    },
  } as const;
}

export default defineConfig({
  plugins: [resolveMuiJsToTs(), react()],
  resolve: {
    alias: [
      // More specific aliases first.
      { find: "@cp949/mui/hooks", replacement: muiHooksSrc },
      { find: "@cp949/mui", replacement: muiSrc },
      // Force React resolution to come from the runner package (React 18 vs 19).
      { find: "react-dom/client", replacement: path.resolve(runnerDir, "node_modules/react-dom/client") },
      { find: "react-dom", replacement: path.resolve(runnerDir, "node_modules/react-dom") },
      { find: "react", replacement: path.resolve(runnerDir, "node_modules/react") },
    ],
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: "127.0.0.1",
    port,
    strictPort: true,
    fs: {
      allow: [workspaceRoot],
    },
  },
  preview: {
    host: "127.0.0.1",
    port,
    strictPort: true,
  },
  build: {
    outDir,
    emptyOutDir: true,
  },
});


