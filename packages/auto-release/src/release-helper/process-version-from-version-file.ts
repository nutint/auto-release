import { listFiles } from "@/release-helper/list-files";
import { supportedVersionFiles } from "@/release-helper/version-helper/version-helper";
import { createVersionHelper } from "@/release-helper/version-helper/create-version-helper";
import { VersionSourceConfiguration } from "@/release-helper/version-source-configuration";

export const processVersionFromVersionFile = async (
  params: VersionSourceConfiguration = {},
): Promise<string> => {
  const { versionFile } = params;

  if (versionFile) {
    return createVersionHelper(versionFile).getVersion();
  }
  const files = listFiles(process.cwd());
  const autoDetectedVersionFile = files.find(
    (file) =>
      supportedVersionFiles.find((supportedFile) =>
        file.endsWith(supportedFile),
      ) !== undefined,
  );
  if (autoDetectedVersionFile === undefined) {
    throw new Error(
      "Check version failed: Unable to located support version files",
    );
  }

  return createVersionHelper(autoDetectedVersionFile).getVersion();
};
