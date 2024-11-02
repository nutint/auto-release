import { gitHelper } from "@/git/git-helper";
import { createLogConfig } from "@/release-helper/release-helper";
import {
  filter,
  lastValueFrom,
  map,
  mergeMap,
  Observable,
  toArray,
} from "rxjs";
import * as semver from "semver";
import { MappedCommit } from "@/git/git-log";
import { ConventionalCommit } from "@/conventional-commit-helper/conventional-commit-helper";

type VersionInfo = {
  latestTags: string[];
  latestStableTags: string[];
};

type GetVersionParams = {
  scope?: string;
  gitTagPrefix?: string;
};

const extractValidTags =
  (gitTagPrefix?: string) =>
  (
    source: Observable<MappedCommit<ConventionalCommit>>,
  ): Observable<VersionInfo> =>
    source.pipe(
      mergeMap((commit) => commit.tags),
      filter((tag) =>
        gitTagPrefix !== undefined ? tag.startsWith(`${gitTagPrefix}@`) : true,
      ),
      map((tag) =>
        gitTagPrefix !== undefined ? tag.replace(`${gitTagPrefix}@`, "") : tag,
      ),
      filter((tag) => semver.valid(tag) !== null),
      toArray(),
      map((tags) => {
        const latestTags = tags.sort(semver.compare);
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
      }),
    );

export const getVersionInfoFromGitHistory = async ({
  scope,
  gitTagPrefix,
}: GetVersionParams): Promise<VersionInfo> => {
  const $result = gitHelper()
    .getLogStream(createLogConfig({ scope }))
    .pipe(extractValidTags(gitTagPrefix));

  return await lastValueFrom($result);
};
