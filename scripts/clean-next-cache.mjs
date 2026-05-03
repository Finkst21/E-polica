import { existsSync, lstatSync, mkdirSync, rmSync, rmdirSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";

const nextDir = resolve(process.cwd(), ".next");
const targetDir = join(process.env.LOCALAPPDATA ?? process.env.TEMP ?? process.cwd(), "Temp", "e-polica-next");

function removePath(path) {
  if (!existsSync(path)) {
    return;
  }

  const stat = lstatSync(path);

  if (stat.isSymbolicLink()) {
    try {
      unlinkSync(path);
    } catch {
      rmdirSync(path);
    }
    return;
  }

  rmSync(path, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 200
  });

  if (existsSync(path) && process.platform === "win32") {
    const quotedPath = path.replace(/'/g, "''");
    execFileSync("powershell.exe", [
      "-NoProfile",
      "-Command",
      `Remove-Item -LiteralPath '${quotedPath}' -Recurse -Force`
    ]);
  }
}

removePath(nextDir);
removePath(targetDir);
mkdirSync(nextDir, { recursive: true });

if (process.platform === "win32") {
  try {
    execFileSync("attrib.exe", ["+P", "-U", nextDir]);
  } catch (error) {
    console.warn("Could not pin .next for OneDrive:", error.message);
  }
}

console.log("Prepared local .next cache.");
