import fs from "fs";
import {
  IVersionHelper,
  VersionHelperError,
} from "@/release-helper/version-helper/version-helper";

export const createBuildSbtHelper = (versionFile: string): IVersionHelper => {
  const fileContent = fs.readFileSync(versionFile, "utf-8");
  const versionMatch = fileContent.match(/version\s*:=\s*"(.*?)"/);
  if (versionMatch === null) {
    throw new VersionHelperError("invalid build.sbt file");
  }

  return {
    versionFileType: "build.sbt",
    getVersion: () => versionMatch[1] as string,
    setVersion: (newVersion: string) => {
      const newFileContent = fileContent.replace(
        /version\s*:=\s*"[\d.]+"/,
        `version := "${newVersion}"`,
      );

      fs.writeFileSync(versionFile, newFileContent, "utf-8");
    },
  };
};
