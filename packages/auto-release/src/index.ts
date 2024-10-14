#!/usr/bin/env node

import fs from "fs";
import path from "path";

export const hello = () => console.log("hello");
export const addFunction = (a: number, b: number) => a + b;

(async () => {
  const args = process.argv.slice(2);
  const configFilePath = args
    .find((arg) => arg.includes("--config"))
    ?.split("=")[1];

  if (configFilePath === undefined) {
    console.error("Please provide a config file using --config");
    process.exit(1);
  }

  const absolutePath = path.resolve(process.cwd(), configFilePath);
  if (fs.existsSync(absolutePath)) {
    const config = JSON.parse(fs.readFileSync(absolutePath, "utf-8"));
    console.log("Configuration Loaded", config);
  } else {
    console.error("Config file not found: ", configFilePath);
    process.exit(1);
  }
})();
