import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

// Swallow the annoying EPERM kill error on Windows
process.on("uncaughtException", (err) => {
  if (err.code === "EPERM" && err.syscall === "kill") {
    console.warn("\x1b[33m%s\x1b[0m", "Caught and ignored EPERM kill error during worker shutdown.");
    return;
  }
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Run the next build command
// We pass the arguments to the next CLI
process.argv = [process.argv[0], path.resolve("node_modules/next/dist/bin/next"), "build"];

require("next/dist/bin/next");
