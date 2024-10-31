import { filter, firstValueFrom, map, Observable, toArray } from "rxjs";
import { ParsedCommit, streamGitLog } from "@/git/stream-git-log";
import { GitCommitRange } from "@/git/stream-git-lines";

export type MappedCommit<T> = ParsedCommit & { mapped: T };

export type GetLogConfig<T> = {
  mapper: (commitMessage: string) => T;
  predicate?: (mappedCommit: MappedCommit<T>) => boolean;
};

export const getGitLogsStream = <T>(
  getLogConfig: GetLogConfig<T>,
  gitCommitRange: GitCommitRange = {},
): Observable<MappedCommit<T>> => {
  return streamGitLog(gitCommitRange).pipe(
    map((parsedCommit) => {
      return {
        ...parsedCommit,
        mapped: getLogConfig.mapper(parsedCommit.message),
      };
    }),
    filter(getLogConfig.predicate ? getLogConfig.predicate : () => true),
  );
};

export const getGitLogs = async <T>(
  getLogConfig: GetLogConfig<T>,
  gitCommitRange: GitCommitRange = {},
): Promise<MappedCommit<T>[]> => {
  const $result = getGitLogsStream(getLogConfig, gitCommitRange).pipe(
    toArray(),
  );
  return await firstValueFrom($result);
};
