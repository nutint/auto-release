import { listFiles } from "@/release-helper/list-files";
import { supportedVersionFiles } from "@/release-helper/version-helper/version-helper";
import { createVersionHelper } from "@/release-helper/version-helper/create-version-helper";

type CheckVersionParams = {
  versionFile?: string;
};

export const checkVersion = async (params: CheckVersionParams = {}) => {
  const { versionFile } = params;
  if (versionFile) {
    const versionHelper = createVersionHelper(versionFile);
    return versionHelper.getVersion();
  }
  const files = await listFiles(process.cwd());
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

  const versionHelper = createVersionHelper(autoDetectedVersionFile);

  return versionHelper.getVersion();
};
