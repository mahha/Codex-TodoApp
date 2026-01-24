import { execFileSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function runReset() {
  execFileSync(npmCommand, ["run", "db:reset"], { stdio: "inherit" });
}

export default async function globalSetup() {
  runReset();
}
