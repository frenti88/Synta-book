import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["opennextjs-cloudflare", "build"], {
  stdio: "inherit",
  shell: false,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

// Next 16 bundles its development file logger into the server function. That
// logger imports Node's `require`, which is not available in a Cloudflare
// Worker. It is unreachable in production, so remove only those two generated
// module wrappers before packaging the Worker.
const handlerPath = ".open-next/server-functions/default/handler.mjs";
const handler = await import("node:fs/promises").then(({ readFile }) =>
  readFile(handlerPath, "utf8"),
);
const loggerStart = handler.indexOf("var require_file_logger=");
const nextModuleStart = handler.indexOf(
  "var require_work_unit_async_storage_instance=",
  loggerStart,
);
if (loggerStart >= 0 && nextModuleStart > loggerStart) {
  const patchedHandler =
    handler.slice(0, loggerStart) +
    "var require_file_logger=()=>({});var require_console_file=()=>({});" +
    handler.slice(nextModuleStart);
  writeFileSync(handlerPath, patchedHandler);
}

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/server", { recursive: true });
cpSync(".open-next", "dist/server/.open-next", { recursive: true });
cpSync("public", "dist/server/.open-next/assets", { recursive: true });
writeFileSync(
  "dist/server/index.js",
  'export { default } from "./.open-next/worker.js";\n',
);
