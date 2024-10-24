import fs from "fs";
import path from "path";
import { extractConfiguration } from "@/cli/validate-config";
import { Configuration } from "@/cli/configuration";

export function readConfiguration(configFileName: string): Configuration {
  const absolutePath = path.resolve(process.cwd(), configFileName);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `read configuration failed: ${absolutePath} does not exists`,
    );
  }
  try {
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const configuration = JSON.parse(fileContent);
    return extractConfiguration(configuration);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(
        `read configuration failed: ${absolutePath} incorrect format: expect JSON`,
      );
    }
    throw e;
  }
}
