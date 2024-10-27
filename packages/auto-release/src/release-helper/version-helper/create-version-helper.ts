import {
  IVersionHelper,
  supportedVersionFiles,
  VersionHelperError,
} from "@/release-helper/version-helper/version-helper";
import { createPackageJsonHelper } from "@/release-helper/version-helper/package-json-helper";
import { createBuildSbtHelper } from "@/release-helper/version-helper/build-sbt-helper";

export const createVersionHelper = (versionFile: string): IVersionHelper => {
  const supportedVersionFile = supportedVersionFiles.find((file) =>
    versionFile.endsWith(file),
  );

  switch (supportedVersionFile) {
    case "package.json":
      return createPackageJsonHelper(versionFile);
    case "build.sbt":
      return createBuildSbtHelper(versionFile);
    default:
      throw new VersionHelperError("unsupported version file");
  }
};
