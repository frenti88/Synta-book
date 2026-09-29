import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["opennextjs-cloudflare", "build"], {
  stdio: "inherit",
  shell: false,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

// Next 16 bundles development-only console instrumentation into the server
// function. Its file logger uses Node's `require`, and console dimming imports
// `node:inspector`; neither API exists in Cloudflare Workers. Remove these
// unreachable-in-production module wrappers before packaging the Worker.
const handlerPath = ".open-next/server-functions/default/handler.mjs";
let handler = await import("node:fs/promises").then(({ readFile }) =>
  readFile(handlerPath, "utf8"),
);
const devConsoleStart = handler.indexOf("var require_file_logger=");
const nextModuleStart = handler.indexOf(
  "var require_work_unit_async_storage_instance=",
  devConsoleStart,
);
if (devConsoleStart >= 0 && nextModuleStart > devConsoleStart) {
  const patchedHandler =
    handler.slice(0, devConsoleStart) +
    "var require_file_logger=()=>({});var require_console_file=()=>({});var require_console_dim_external=()=>({});" +
    handler.slice(nextModuleStart);
  // OpenNext emits another copy of the dim module later in the same bundle,
  // outside the contiguous wrapper block above. Keep its behavior harmless in
  // production without importing Node's inspector API.
  handler = patchedHandler.replace(
    'require("node:inspector")',
    '({url:()=>undefined})',
  );
  writeFileSync(handlerPath, handler);
}

// Next's node-crypto extension is also Node-only. OpenNext includes it even
// though this Worker uses Web Crypto; remove that generated module wrapper.
const nodeCryptoStart = handler.indexOf("var require_node_crypto=__commonJS({");
const nodeEnvironmentStart = handler.indexOf("var require_node_environment=", nodeCryptoStart);
const nodeCryptoEnd = handler.lastIndexOf("}});", nodeEnvironmentStart);
if (nodeCryptoStart >= 0 && nodeCryptoEnd > nodeCryptoStart) {
  const patchedHandler =
    handler.slice(0, nodeCryptoStart) +
    "var require_node_crypto=()=>({});" +
    handler.slice(nodeCryptoEnd + 4);
  handler = patchedHandler;
  writeFileSync(handlerPath, handler);
}

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/server", { recursive: true });
cpSync(".open-next", "dist/server/.open-next", { recursive: true });
cpSync("public", "dist/server/.open-next/assets", { recursive: true });
writeFileSync(
  "dist/server/index.js",
  'export { default } from "./.open-next/worker.js";\n',
);
