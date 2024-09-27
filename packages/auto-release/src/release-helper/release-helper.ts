import { GetLogConfig, MappedCommit } from "@/git/git-log";
import {
  ConventionalCommit,
  parseConventionalMessage,
} from "@/conventional-commit-helper/conventional-commit-helper";

export type ConventionalLogConfigParams = {
  scope?: string;
};

export const createLogConfig = ({
  scope,
}: ConventionalLogConfigParams = {}): GetLogConfig<ConventionalCommit> => {
  const mapper = (commitMessage: string): ConventionalCommit =>
    parseConventionalMessage(commitMessage);
  if (scope) {
    return {
      mapper,
      predicate: (mappedCommit: MappedCommit<ConventionalCommit>) =>
        mappedCommit.mapped.scope === scope,
    };
  }
  return {
    mapper,
  };
};
