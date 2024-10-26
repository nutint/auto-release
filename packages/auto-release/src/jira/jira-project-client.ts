import { Version3Client } from "jira.js";

type JiraIssueInput = {
  summary: string;
  issueType?: string;
};

type JiraIssue = JiraIssueInput & { id: string; key: string };

type JiraVersionInput = {
  name: string;
};

type JiraVersion = JiraVersionInput & {
  url?: string;
  id?: string;
  description?: string;
};

export type IJiraProjectClient<T> = {
  key: string;
  id: string;
  _client: T;
  createIssue: (input: JiraIssueInput) => Promise<JiraIssue>;
  getIssue: (issueKey: string) => Promise<JiraIssue>;
  createVersion: (input: JiraVersionInput) => Promise<JiraVersion>;
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

    return {
      name: input.name,
      url: createdVersion.self,
      id: createdVersion.id,
      description: createdVersion.description,
    };
  },
});
