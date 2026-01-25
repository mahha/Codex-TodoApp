import { execFileSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function runReset() {
  execFileSync(npmCommand, ["run", "db:reset"], {
    stdio: "inherit",
    env: {
      ...process.env,
      HOME: "/tmp",
      XDG_CONFIG_HOME: "/tmp",
    },
  });
}

export default async function globalSetup() {
  runReset();
}
