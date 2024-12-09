import {
  getGitLogs,
  getGitLogsStream,
  GetLogConfig,
  MappedCommit,
} from "@/git/git-log";
import { Observable } from "rxjs";

import { GitCommitRange } from "@/git/stream-git-lines";

type IGitHelper = {
  getLogs: <T>(
    getLogConfig: GetLogConfig<T>,
    gitCommitRange?: GitCommitRange,
  ) => Promise<MappedCommit<T>[]>;
  getLogStream: <T extends { subject: string }>(
    getLogConfig: GetLogConfig<T>,
    gitCommitRange?: GitCommitRange,
  ) => Observable<MappedCommit<T>>;
};

export const gitHelper = (): IGitHelper => {
  return {
    getLogs: async <T>(
      getLogConfig: GetLogConfig<T>,
      gitCommitRange: GitCommitRange = {},
    ) => {
      return await getGitLogs<T>(getLogConfig, gitCommitRange);
    },
    getLogStream: <T extends { subject: string }>(
      getLogConfig: GetLogConfig<T>,
      gitCommitRange: GitCommitRange = {},
    ) => getGitLogsStream(getLogConfig, gitCommitRange),
  };
};
