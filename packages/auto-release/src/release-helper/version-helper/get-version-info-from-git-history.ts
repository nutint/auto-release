import { filter, map, mergeMap, Observable, toArray } from "rxjs";
import * as semver from "semver";
import { MappedCommit } from "@/git/git-log";

export type VersionInfo = {
  latestTags: string[];
  latestStableTags: string[];
};

export const $extractTags =
  (gitTagPrefix?: string) =>
  <T>(
    $conventionalCommits: Observable<MappedCommit<T>>,
  ): Observable<VersionInfo> => {
    const prefixString = `${gitTagPrefix}@`;
    return $conventionalCommits.pipe(
      mergeMap((commit) => commit.tags),
      filter((tag) =>
        gitTagPrefix !== undefined ? tag.startsWith(prefixString) : true,
      ),
      map((tag) =>
        gitTagPrefix !== undefined ? tag.replace(prefixString, "") : tag,
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
  };
