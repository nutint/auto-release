import { JiraConfiguration } from "@/jira/jira-configuration";
import { createJiraClient } from "@/jira/create-jira-client";

export const createJiraRelease = async (
  jiraConfiguration: JiraConfiguration,
  projectKey: string,
  version: string,
  jiraIssues: string[],
) => {
  const jiraClient = createJiraClient(jiraConfiguration);
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
