import { Version3Client } from "jira.js";
import { JiraJsVersionClientV3 } from "@/jira/jira-js-v3/jira-js-version-client-v3";
import { JiraVersionInput } from "@/jira/jira-version-models";
import { JiraIssueInput } from "@/jira/jira-issue-models";
import {
  IJiraProjectClient,
  JiraProjectClientParams,
} from "@/jira/jira-project-client";

export const JiraJsProjectClientV3 = ({
  key: projectKey,
  id: projectId,
  jiraJsClient,
}: JiraProjectClientParams<Version3Client>): IJiraProjectClient<Version3Client> => ({
  key: projectKey,
  id: projectId,
  _client: jiraJsClient,
  createIssue: async (input: JiraIssueInput) => {
    const { key, id } = await jiraJsClient.issues.createIssue({
      fields: {
        summary: input.summary,
        issuetype: {
          name: input.issueType,
        },
        project: {
          key: projectKey,
        },
      },
    });

    return {
      ...input,
      key,
      id,
    };
  },
  getIssue: async (issueKey: string) => {
    const foundIssue = await jiraJsClient.issues.getIssue({
      issueIdOrKey: issueKey,
    });

    return {
      key: issueKey,
      id: foundIssue.id,
      issueType: foundIssue.fields.issuetype?.name,
      summary: foundIssue.fields.summary,
    };
  },
  createVersion: async (input: JiraVersionInput) => {
    const createdVersion = await jiraJsClient.projectVersions.createVersion({
      name: input.name,
      projectId: parseInt(projectId),
    });

    return JiraJsVersionClientV3({
      name: input.name,
      url: createdVersion.self,
      id: createdVersion.id!,
      description: createdVersion.description,
      _client: jiraJsClient,
    });
  },
  getVersions: async () => {
    const versions = await jiraJsClient.projectVersions.getProjectVersions({
      projectIdOrKey: projectKey,
    });
    return versions.map(({ name, self, id, description }) =>
      JiraJsVersionClientV3({
        name: name || "",
        url: self,
        id: id!,
        description,
        _client: jiraJsClient,
      }),
    );
  },
});
