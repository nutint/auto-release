import { gitHelper } from "@/git/git-helper";
import { createLogConfig } from "@/release-helper/release-helper";
import { filter, lastValueFrom, mergeMap, toArray } from "rxjs";
import * as semver from "semver";

export const getLatestTags = async (): Promise<string[]> => {
  const $result = gitHelper()
    .getLogStream(createLogConfig({ scope: "auto-release" }))
    .pipe(
      mergeMap((commit) => commit.tags),
      filter((tag) => semver.valid(tag) !== null),
      toArray(),
    );

  return (await lastValueFrom($result)).sort(semver.compare);
};
