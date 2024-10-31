import { gitHelper } from "@/git/git-helper";
import { createLogConfig } from "@/release-helper/release-helper";
import { filter, lastValueFrom, map, mergeMap, toArray } from "rxjs";
import * as semver from "semver";

type VersionInfo = {
  latestTags: string[];
  latestStableTags: string[];
};

type GetVersionParams = {
  scope?: string;
  gitTagPrefix?: string;
};

export const getVersionInfoFromGitHistory = async ({
  scope,
  gitTagPrefix,
}: GetVersionParams): Promise<VersionInfo> => {
  const $result = gitHelper()
    .getLogStream(createLogConfig({ scope }))
    .pipe(
      mergeMap((commit) => commit.tags),
      filter((tag) =>
        gitTagPrefix !== undefined ? tag.startsWith(`${gitTagPrefix}@`) : true,
      ),
      map((tag) =>
        gitTagPrefix !== undefined ? tag.replace(`${gitTagPrefix}@`, "") : tag,
      ),
      filter((tag) => semver.valid(tag) !== null),
      toArray(),
    );

  const latestTags = (await lastValueFrom($result)).sort(semver.compare);
  return {
    latestTags: latestTags.map((ver) =>
      gitTagPrefix !== undefined ? `${gitTagPrefix}@${ver}` : ver,
    ),
    latestStableTags: latestTags
      .filter((tag) => !semver.prerelease(tag))
      .map((ver) =>
        gitTagPrefix !== undefined ? `${gitTagPrefix}@${ver}` : ver,
      ),
  };
};
