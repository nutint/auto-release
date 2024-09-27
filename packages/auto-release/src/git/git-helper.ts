import {
  getGitLogs,
  GetLogConfig,
  GitCommitRange,
  MappedCommit,
} from "@/git/git-log";

type IGitHelper = {
  getLogs: <T>(
    getLogConfig: GetLogConfig<T>,
    gitCommitRange?: GitCommitRange,
  ) => Promise<MappedCommit<T>[]>;
};

export const gitHelper = (): IGitHelper => {
  return {
    getLogs: async <T>(
      getLogConfig: GetLogConfig<T>,
      gitCommitRange: GitCommitRange = {},
    ) => {
      return await getGitLogs<T>(getLogConfig, gitCommitRange);
    },
  };
};
