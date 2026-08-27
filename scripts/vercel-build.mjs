import { rename, access, mkdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const projectRoot = process.cwd();
const disabledPaths = [
  path.join(projectRoot, "src", "app", "api"),
  path.join(projectRoot, "src", "app", "(routes)", "(protected)"),
  path.join(projectRoot, "src", "app", "(routes)", "(home)", "(inner-pages)", "cart"),
  path.join(projectRoot, "src", "app", "(routes)", "(home)", "(inner-pages)", "wishlist"),
  path.join(projectRoot, "src", "app", "(routes)", "(home)", "(inner-pages)", "about"),
  path.join(projectRoot, "src", "app", "(routes)", "(home)", "(inner-pages)", "certificates"),
  path.join(projectRoot, "src", "app", "(routes)", "(home)", "(inner-pages)", "deals"),
  path.join(projectRoot, "src", "app", "(routes)", "(home)", "(inner-pages)", "kit-installation"),
  path.join(projectRoot, "src", "app", "(routes)", "(home)", "(inner-pages)", "vehicle-registration"),
  path.join(projectRoot, "src", "app", "(routes)", "(home)", "(inner-pages)", "reviews"),
  path.join(projectRoot, "src", "app", "(routes)", "(home)", "(inner-pages)", "kit-installation", "[slug]"),
];
const movedPaths = disabledPaths.map((source) => ({
  source,
  backup: path.join(projectRoot, ".vercel-demo-disabled", path.relative(projectRoot, source)),
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
    await mkdir(path.join(projectRoot, ".vercel-demo-disabled"), { recursive: true });
    for (const { source, backup } of movedPaths) {
      if (await exists(source)) {
        await mkdir(path.dirname(backup), { recursive: true });
        await rename(source, backup);
      }
    }
  }
  exitCode = await runNextBuild();
} finally {
  for (const { source, backup } of [...movedPaths].reverse()) {
    if (await exists(backup)) {
      await mkdir(path.dirname(source), { recursive: true });
      await rename(backup, source);
    }
  }
  await rm(path.join(projectRoot, ".vercel-demo-disabled"), { recursive: true, force: true });
}

process.exitCode = exitCode;
