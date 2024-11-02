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
  const { gitTagPrefix, scope } = versionSourceConfiguration;
  const { latestGitTag, jiraIssues } = await processVersionFromGitHistory({
    gitTagPrefix,
    scope,
    jiraProjectKey: "SCRUM",
  });
  const packageVersion = await processVersionFromVersionFile(
    versionSourceConfiguration,
  );
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
      issues: jiraIssues,
      projectKey: "SCRUM",
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
  jira: {
    issues: JiraIssueWithCommits[];
    projectKey: string;
  };
};
