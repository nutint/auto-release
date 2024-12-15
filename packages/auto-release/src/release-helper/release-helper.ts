import { GetLogConfigV2, MappedCommit } from "@/git/git-log";
import { processVersionFromVersionFile } from "@/release-helper/process-version-from-version-file";
import { VersionSourceConfiguration } from "@/release-helper/version-source-configuration";
import {
  JiraIssueWithCommits,
  processVersionFromGitHistory,
} from "@/release-helper/process-version-from-git-history";

import { OutputFormat } from "@/cli/arguments/common-arguments";
import {
  CommitInfo,
  extractCommitInfo,
} from "@/release-helper/commit-info/extract-commit-info";
import {
  customFormatParser,
  defaultCommitFormat,
} from "@/custom-commit-parser/custom-format-parser";
import { formatSyntaxParser } from "@/custom-commit-parser/format-syntax-parser";
import { Changes } from "@/release-helper/process-changes-from-git-history";

export type ConventionalLogConfigParams = {
  scope?: string;
  commitFormat?: string;
};

export const createLogConfig = ({
  scope,
  commitFormat: overrideCommitFormat,
}: ConventionalLogConfigParams = {}): GetLogConfigV2 => {
  const commitFormat = overrideCommitFormat ?? defaultCommitFormat;
  const formatElements = formatSyntaxParser(commitFormat);
  const mapper = (commitMessage: string) => {
    const extracts = customFormatParser(formatElements, commitMessage);
    return extractCommitInfo(extracts);
  };

  if (scope) {
    return {
      predicate: (commitInfo: MappedCommit<CommitInfo>) =>
        commitInfo.mapped.scope === scope,
      mapper,
    };
  }
  return {
    mapper,
  };
};

export const extractReleaseInformation = async (
  versionSourceConfiguration: VersionSourceConfiguration = {},
): Promise<ReleaseInformation> => {
  const { gitTagPrefix, scope, jiraProjectKey, commitFormat } =
    versionSourceConfiguration;
  const { latestGitTag, jiraIssues, changes } =
    await processVersionFromGitHistory({
      gitTagPrefix,
      scope,
      jiraProjectKey,
      commitFormat,
    });
  const packageVersion = await processVersionFromVersionFile(
    versionSourceConfiguration,
  );

  const commonReleaseInformation = {
    currentVersion: packageVersion,
    latestTagVersion: latestGitTag,
    nextVersion: "1.0.1",
    changes,
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
  changes: Changes;
  jira?: {
    issues: JiraIssueWithCommits<CommitInfo>[];
    projectKey: string;
  };
};

export const printReleaseInformation = <T extends { subject: string }>(
  releaseInformation: ReleaseInformation,
  outputFormat: OutputFormat,
) => {
  if (outputFormat === "json") {
    console.log(JSON.stringify(releaseInformation));
  } else {
    const message = [
      "Release Information:",
      `  Current version: ${releaseInformation.currentVersion}`,
      `  Latest tagged version: ${releaseInformation.latestTagVersion === undefined ? "none" : releaseInformation.latestTagVersion}`,
      `  Next version: ${releaseInformation.nextVersion}`,
    ].join("\n");
    console.log(message);
  }
};
