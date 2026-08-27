import { rename, access } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const projectRoot = process.cwd();
const disabledPaths = [
  path.join(projectRoot, "src", "app", "api"),
  path.join(projectRoot, "src", "app", "(routes)", "(protected)"),
];
const movedPaths = disabledPaths.map((source) => ({
  source,
  backup: `${source}.vercel-demo-disabled`,
}));

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function runNextBuild() {
  return new Promise((resolve) => {
    const command = process.platform === "win32" ? "npx.cmd" : "npx";
    const child = spawn(command, ["next", "build"], {
      cwd: projectRoot,
      stdio: "inherit",
      env: process.env,
    });
    child.on("close", (code) => resolve(code ?? 1));
  });
}

const demoMode = process.env.DEMO_MODE !== "false";
let exitCode = 1;

try {
  if (demoMode) {
    for (const { source, backup } of movedPaths) {
      if (await exists(source)) await rename(source, backup);
    }
  }
  exitCode = await runNextBuild();
} finally {
  for (const { source, backup } of [...movedPaths].reverse()) {
    if (await exists(backup)) await rename(backup, source);
  }
}

process.exitCode = exitCode;
