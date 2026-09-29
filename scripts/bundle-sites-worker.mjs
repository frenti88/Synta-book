import { cpSync, mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < 22) {
  throw new Error("The Sites Worker bundling step requires Node.js 22 or newer (Wrangler 4).");
}

const outdir = mkdtempSync(path.join(os.tmpdir(), "synta-worker-bundle-"));
try {
  const result = spawnSync(
    process.execPath,
    [
      "node_modules/wrangler/bin/wrangler.js",
      "deploy",
      "--dry-run",
      "--config",
      "wrangler.jsonc",
      "--outdir",
      outdir,
    ],
    {
      stdio: "inherit",
      shell: false,
      env: { ...process.env, WRANGLER_LOG_PATH: path.join(outdir, "wrangler.log") },
    },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
  cpSync(path.join(outdir, "worker.js"), "dist/server/index.js");
} finally {
  rmSync(outdir, { recursive: true, force: true });
}
