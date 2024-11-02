import { $extractTags } from "@/release-helper/version-helper/get-version-info-from-git-history";
import { lastValueFrom, map, Observable } from "rxjs";
import { MappedCommit } from "@/git/git-log";
import { ConventionalCommit } from "@/conventional-commit-helper/conventional-commit-helper";
import { gitHelper } from "@/git/git-helper";
import { createLogConfig } from "@/release-helper/release-helper";

type ProcessVersionParams = {
  gitTagPrefix?: string;
  scope?: string;
};

export const processVersionFromGitHistory = async ({
  gitTagPrefix,
  scope,
}: ProcessVersionParams) => {
  const $result = gitHelper()
    .getLogStream(createLogConfig({ scope }))
    .pipe($processVersionFromGitHistory({ gitTagPrefix }));

  return await lastValueFrom($result);
};

export const $processVersionFromGitHistory =
  ({ gitTagPrefix }: ProcessVersionParams) =>
  (source: Observable<MappedCommit<ConventionalCommit>>) =>
    source.pipe(
      $extractTags(gitTagPrefix),
      map(
        (versionInfo) =>
          versionInfo.latestStableTags[versionInfo.latestStableTags.length - 1],
      ),
    );
