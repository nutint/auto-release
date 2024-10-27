import { GetLogConfig, MappedCommit } from "@/git/git-log";
import {
  ConventionalCommit,
  parseConventionalMessage,
} from "@/conventional-commit-helper/conventional-commit-helper";
import { checkVersion } from "@/release-helper/check-version";

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

export const extractReleaseInformation = () => {
  const { packageVersion, latestGitTag } = checkVersion();
  return {
    currentVersion: packageVersion,
    latestTagVersion: latestGitTag,
    nextVersion: "1.0.1",
    changes: {
      minor: [],
      major: [],
      patch: [],
    },
    jira: {
      tickets: ["SCRUM-1", "SCRUM-2"],
      projectKey: "SCRUM",
    },
  };
};
