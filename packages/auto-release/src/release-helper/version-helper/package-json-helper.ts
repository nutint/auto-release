import {
  IVersionHelper,
  VersionHelperError,
} from "@/release-helper/version-helper/version-helper";
import fs from "fs";

export const createPackageJsonHelper = (
  versionFile: string,
): IVersionHelper => {
  const content = fs.readFileSync(versionFile, "utf-8");
  try {
    const { version } = JSON.parse(content);
    if (version) {
      return {
        getVersion: () => version,
        setVersion: (newVersion: string) => {
          const updatedPackageJsonContent = content.replace(
            /"version":\s*"[\d.]+"/,
            `"version": "${newVersion}"`,
          );
          fs.writeFileSync(versionFile, updatedPackageJsonContent, "utf-8");
        },
        versionFileType: "package.json",
      };
    }
  } catch (e) {}
  throw new VersionHelperError("invalid package.json file");
};
