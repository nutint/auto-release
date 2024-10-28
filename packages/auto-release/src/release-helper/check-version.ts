import { listFiles } from "@/release-helper/list-files";
import { supportedVersionFiles } from "@/release-helper/version-helper/version-helper";
import { createVersionHelper } from "@/release-helper/version-helper/create-version-helper";
import { getVersionInfoFromGitHistory } from "@/release-helper/version-helper/get-version-info-from-git-history";

type CheckVersionParams = {
  versionFile?: string;
};

type Version = {
  packageVersion: string;
  latestGitTag?: string;
};

export const checkVersion = async (
  params: CheckVersionParams = {},
): Promise<Version> => {
  const { versionFile } = params;

  const { latestStableTags } = await getVersionInfoFromGitHistory();
  const latestGitTag = latestStableTags[latestStableTags.length - 1];

  if (versionFile) {
    const versionHelper = createVersionHelper(versionFile);
    return {
      packageVersion: versionHelper.getVersion(),
      latestGitTag,
    };
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

  return {
    packageVersion: versionHelper.getVersion(),
    latestGitTag,
  };
};
