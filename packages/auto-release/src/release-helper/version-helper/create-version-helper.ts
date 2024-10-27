import {
  IVersionHelper,
  supportedVersionFiles,
  VersionHelperError,
} from "@/release-helper/version-helper/version-helper";
import { createPackageJsonHelper } from "@/release-helper/version-helper/package-json-helper";

export const createVersionHelper = (versionFile: string): IVersionHelper => {
  const supportedVersionFile = supportedVersionFiles.find((file) =>
    versionFile.endsWith(file),
  );
  if (supportedVersionFile === undefined) {
    throw new VersionHelperError("unsupported version file");
  }
  return createPackageJsonHelper(versionFile);
};
