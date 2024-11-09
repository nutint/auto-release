import { GetLogConfig, MappedCommit } from "@/git/git-log";
import {
  ConventionalCommit,
  parseConventionalMessage,
} from "@/conventional-commit-helper/conventional-commit-helper";
import { processVersionFromVersionFile } from "@/release-helper/process-version-from-version-file";
import { VersionSourceConfiguration } from "@/release-helper/version-source-configuration";
import {
  JiraIssueWithCommits,
  processVersionFromGitHistory,
} from "@/release-helper/process-version-from-git-history";

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

export const extractReleaseInformation = async (
  versionSourceConfiguration: VersionSourceConfiguration = {},
): Promise<ReleaseInformation> => {
  const { gitTagPrefix, scope, jiraProjectKey } = versionSourceConfiguration;
  const { latestGitTag, jiraIssues } = await processVersionFromGitHistory({
    gitTagPrefix,
    scope,
    jiraProjectKey,
  });
  const packageVersion = await processVersionFromVersionFile(
    versionSourceConfiguration,
  );

  const commonReleaseInformation = {
    currentVersion: packageVersion,
    latestTagVersion: latestGitTag,
    nextVersion: "1.0.1",
    changes: {
      minor: [],
      major: [],
      patch: [],
    },
  };

  if (jiraProjectKey === undefined) {
    return {
      ...commonReleaseInformation,
    };
  }

  return {
    ...commonReleaseInformation,
    jira: {
      issues: jiraIssues,
      projectKey: jiraProjectKey,
    },
  };
};

export type ReleaseInformation = {
  currentVersion: string;
  latestTagVersion?: string;
  nextVersion: string;
  changes: {
    minor: string[];
    major: string[];
    patch: string[];
  };
  jira?: {
    issues: JiraIssueWithCommits[];
    projectKey: string;
  };
};
