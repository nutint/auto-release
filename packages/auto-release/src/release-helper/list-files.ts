import fs from "fs";

export const listFiles = (directory: string): string[] => {
  return fs.readdirSync(directory);
};
