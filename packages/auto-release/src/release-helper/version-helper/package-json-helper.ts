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
        getVersion: () => {
          return {
            packageVersion: version,
            latestGitTag: "1.0.1",
          };
        },
        versionFileType: "package.json",
      };
    }
  } catch (e) {}
  throw new VersionHelperError("invalid package.json file");
};
