import { Version3Client } from "jira.js";
import {
  IJiraVersionClient,
  JiraVersionClient,
  JiraVersionInput,
} from "@/jira/jira-js-v3/jira-version-client";

type JiraIssueInput = {
  summary: string;
  issueType?: string;
};

type JiraIssue = JiraIssueInput & { id: string; key: string };

export type IJiraProjectClient<T> = {
  key: string;
  id: string;
  _client: T;
  createIssue: (input: JiraIssueInput) => Promise<JiraIssue>;
  getIssue: (issueKey: string) => Promise<JiraIssue>;
  createVersion: (input: JiraVersionInput) => Promise<IJiraVersionClient<T>>;
  getVersions: () => Promise<IJiraVersionClient<T>[]>;
};

export type JiraProjectClientParams<T> = {
  key: string;
  id: string;
  jiraJsClient: T;
};

export const JiraProjectClient = ({
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

    return JiraVersionClient({
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
      JiraVersionClient({
        name: name || "",
        url: self,
        id: id!,
        description,
        _client: jiraJsClient,
      }),
    );
  },
});
