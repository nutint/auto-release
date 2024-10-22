import fs from "fs";
import path from "path";

export function readConfiguration(configFileName: string) {
  const absolutePath = path.resolve(process.cwd(), configFileName);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `read configuration failed: ${absolutePath} does not exists`,
    );
  }
  try {
    const fileContent = fs.readFileSync(absolutePath, "utf-8");
    const configuration = JSON.parse(fileContent);

    return configuration;
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(
        `read configuration failed: ${absolutePath} incorrect format: expect JSON`,
      );
    }
  }
}
