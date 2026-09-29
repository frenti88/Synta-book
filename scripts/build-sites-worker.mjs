import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["opennextjs-cloudflare", "build"], {
  stdio: "inherit",
  shell: false,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

// Next 16 bundles its Node-specific environment initializer into the Worker.
// That initializer installs Node console, inspector, crypto, and timer hooks;
// these are not needed by the edge runtime and require Node APIs unavailable
// in this Workers execution context. Replace the initializer, not each hook.
const handlerPath = ".open-next/server-functions/default/handler.mjs";
const handler = await import("node:fs/promises").then(({ readFile }) =>
  readFile(handlerPath, "utf8"),
);
const nodeEnvironmentStart = handler.indexOf(
  "var require_node_environment=__commonJS({",
);
const nodeEnvironmentEnd = handler.indexOf("}});var require_", nodeEnvironmentStart);
if (nodeEnvironmentStart < 0 || nodeEnvironmentEnd < 0) {
  throw new Error("Could not locate Next's generated node-environment module.");
}
const patchedHandler =
  handler.slice(0, nodeEnvironmentStart) +
  "var require_node_environment=()=>({});" +
  handler.slice(nodeEnvironmentEnd + 4);
writeFileSync(handlerPath, patchedHandler);

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/server", { recursive: true });
cpSync(".open-next", "dist/server/.open-next", { recursive: true });
cpSync("public", "dist/server/.open-next/assets", { recursive: true });
writeFileSync(
  "dist/server/index.js",
  'export { default } from "./.open-next/worker.js";\n',
);
