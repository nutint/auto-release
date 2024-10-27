import fs from "fs";

export const listFiles = async (directory: string): Promise<string[]> => {
  return await new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
      }

      resolve(files);
    });
  });
};
