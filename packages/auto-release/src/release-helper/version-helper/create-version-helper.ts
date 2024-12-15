import {
  IVersionHelper,
  supportedVersionFiles,
  VersionHelperError,
} from "@/release-helper/version-helper/version-helper";
import { createPackageJsonHelper } from "@/release-helper/version-helper/package-json-helper";
import { createBuildSbtHelper } from "@/release-helper/version-helper/build-sbt-helper";
import { listFiles } from "@/release-helper/list-files";

const autoDetectVersionFile = () => {
  const files = listFiles(process.cwd());
  const autoDetectedVersionFile = files.find(
    (file) =>
      supportedVersionFiles.find((supportedFile) =>
        file.endsWith(supportedFile),
      ) !== undefined,
  );
  if (autoDetectedVersionFile === undefined) {
    throw new VersionHelperError("unable to located support version file");
  }
  return autoDetectedVersionFile;
};

export const createVersionHelper = (versionFile?: string): IVersionHelper => {
  const detectedVersionFile =
    versionFile === undefined ? autoDetectVersionFile() : versionFile;

  const supportedVersionFile = supportedVersionFiles.find((file) =>
    detectedVersionFile.endsWith(file),
  );

  switch (supportedVersionFile) {
    case "package.json":
      return createPackageJsonHelper(detectedVersionFile);
    case "build.sbt":
      return createBuildSbtHelper(detectedVersionFile);
    default:
      throw new VersionHelperError("unsupported version file");
  }
};
