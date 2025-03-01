#!/usr/bin/env node

import { processCli } from "@/cli/process-cli";

export const hello = () => console.log("hello world");
export const addFunction = (a: number, b: number) => a + b;

(async () => {
  const args = process.argv.slice(2);
  await processCli(args);
})();
