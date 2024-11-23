export type CreateJiraRelease = {
  command: "CreateJiraRelease";
  projectKey: string;
  versionName: string;
  issues: string[];
};

export const parseCreateJiraReleaseCommand = (
  args: string[],
): CreateJiraRelease => {
  const jiraProjectKeyParam = args.find((arg) =>
    arg.startsWith("--jira-project-key="),
  );

  if (jiraProjectKeyParam === undefined) {
    throw new InvalidCreateJiraReleaseCommand("--jira-project-key required");
  }

  const [, jiraProjectKey] = jiraProjectKeyParam.split("--jira-project-key=");
  if (jiraProjectKey === "") {
    throw new InvalidCreateJiraReleaseCommand(
      "missing --jira-project-key value",
    );
  }

  const jiraVersionNameParam = args.find((arg) =>
    arg.startsWith("--jira-version-name="),
  );
  if (jiraVersionNameParam === undefined) {
    throw new InvalidCreateJiraReleaseCommand("missing --jira-version-name");
  }
  const [, jiraVersionName] = jiraVersionNameParam.split(
    "--jira-version-name=",
  );
  if (jiraVersionName === "") {
    throw new InvalidCreateJiraReleaseCommand(
      "missing --jira-version-name value",
    );
  }

  const jiraIssueIdsParam = args.find((arg) =>
    arg.startsWith("--jira-issues="),
  );

  if (jiraIssueIdsParam === undefined) {
    return {
      command: "CreateJiraRelease",
      projectKey: jiraProjectKey!,
      versionName: jiraVersionName!,
      issues: [],
    };
  }

  const [, jiraIssueIdsString] = jiraIssueIdsParam.split("--jira-issues=");
  if (jiraIssueIdsString == "") {
    return {
      command: "CreateJiraRelease",
      projectKey: jiraProjectKey!,
      versionName: jiraVersionName!,
      issues: [],
    };
  }

  return {
    command: "CreateJiraRelease",
    projectKey: jiraProjectKey!,
    versionName: jiraVersionName!,
    issues: jiraIssueIdsString!
      .split(",")
      .filter((issue) => issue.startsWith(`${jiraProjectKey}-`)),
  };
};

export class InvalidCreateJiraReleaseCommand extends Error {
  constructor(message: string) {
    super(`InvalidCreateJiraReleaseCommand: ${message}`);
  }
}
