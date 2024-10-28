import { gitHelper } from "@/git/git-helper";
import { createLogConfig } from "@/release-helper/release-helper";
import { filter, lastValueFrom, mergeMap, toArray } from "rxjs";
import * as semver from "semver";

type VersionInfo = {
  latestTags: string[];
  latestStableTags: string[];
};

export const getVersionInfoFromGitHistory = async (): Promise<VersionInfo> => {
  const $result = gitHelper()
    .getLogStream(createLogConfig({ scope: "auto-release" }))
    .pipe(
      mergeMap((commit) => commit.tags),
      filter((tag) => semver.valid(tag) !== null),
      toArray(),
    );

  const latestTags = (await lastValueFrom($result)).sort(semver.compare);
  return {
    latestTags,
    latestStableTags: latestTags.filter((tag) => !semver.prerelease(tag)),
  };
};
