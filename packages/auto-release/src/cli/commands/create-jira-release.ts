import { JiraConfiguration } from "@/jira/jira-configuration";
import { createJiraClient } from "@/jira/create-jira-client";
import { Configuration } from "@/cli/configuration";
import { parseCreateJiraReleaseCommand } from "@/cli/arguments/create-jira-release-command";

export const createJiraReleaseWithParams = async (
  jiraConfiguration: JiraConfiguration,
  projectKey: string,
  version: string,
  jiraIssues: string[],
) => {
  const jiraClient = await createJiraClient(jiraConfiguration);
  const jiraProjectClient = await jiraClient.getProject(projectKey);
  if (jiraProjectClient === undefined) {
    throw new CreateJiraReleaseError(`project ${projectKey} not found`);
  }
  const versions = await jiraProjectClient.getVersions();
  if (versions.find(({ name }) => name === version) !== undefined) {
    throw new CreateJiraReleaseError(`version ${version} is already existed`);
  }
  const jiraVersion = await jiraProjectClient.createVersion({ name: version });
  await jiraVersion.tagIssuesFixVersion(jiraIssues);
};

export class CreateJiraReleaseError extends Error {
  constructor(message: string) {
    super(`CreateJiraReleaseError: ${message}`);
  }
}

export const createJiraRelease = async (
  configuration: Configuration,
  args: string[],
) => {
  const { jiraConfiguration } = configuration;
  if (jiraConfiguration === undefined) {
    throw new CreateJiraReleaseError("missing Jira configuration");
  }

  const { projectKey, versionName, issues } =
    parseCreateJiraReleaseCommand(args);
  await createJiraReleaseWithParams(
    jiraConfiguration,
    projectKey,
    versionName,
    issues,
  );
};
