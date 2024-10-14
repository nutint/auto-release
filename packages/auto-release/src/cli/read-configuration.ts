import fs from "fs";
import path from "path";

export function readConfiguration(configFileName: string) {
  const absolutePath = path.resolve(process.cwd(), configFileName);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `read configuration failed: ${absolutePath} does not exists`,
    );
  }
  return { foo: "bar" };
}
