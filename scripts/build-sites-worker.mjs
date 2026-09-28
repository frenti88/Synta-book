import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["opennextjs-cloudflare", "build"], {
  stdio: "inherit",
  shell: false,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/server", { recursive: true });
cpSync(".open-next", "dist/server/.open-next", { recursive: true });
cpSync("public", "dist/server/.open-next/assets", { recursive: true });
writeFileSync(
  "dist/server/index.js",
  'export { default } from "./.open-next/worker.js";\n',
);
