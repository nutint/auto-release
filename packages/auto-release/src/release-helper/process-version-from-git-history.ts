import { getVersionInfoFromGitHistory } from "@/release-helper/version-helper/get-version-info-from-git-history";

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
