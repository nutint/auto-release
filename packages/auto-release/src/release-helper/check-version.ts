import { listFiles } from "@/release-helper/list-files";
import { supportedVersionFiles } from "@/release-helper/version-helper/version-helper";
import { createVersionHelper } from "@/release-helper/version-helper/create-version-helper";
import { getVersionInfoFromGitHistory } from "@/release-helper/version-helper/get-version-info-from-git-history";
import { VersionSourceConfiguration } from "@/release-helper/version-source-configuration";

type ProcessVersionParams = {
  gitTagPrefix?: string;
  scope?: string;
};

export const processVersionFromGitHistory = async ({
  gitTagPrefix,
  scope,
}: ProcessVersionParams) => {
  const { latestStableTags } = await getVersionInfoFromGitHistory({
    scope,
    gitTagPrefix,
  });
  return latestStableTags[latestStableTags.length - 1];
};

export const checkVersion = async (
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
