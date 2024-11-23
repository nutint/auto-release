import { HttpException, Version3Client } from "jira.js";
import { JiraJsVersionClientV3 } from "@/jira/jira-js-v3/jira-js-version-client-v3";
import { JiraVersionInput } from "@/jira/jira-version-models";
import {
  CreateJiraIssueParams,
  JiraIssue,
  JiraIssueOperationError,
} from "@/jira/jira-issue-models";
import {
  IJiraProjectClient,
  JiraProjectClientParams,
} from "@/jira/jira-project-client";
import { jiraIssueV3Schema } from "@/jira/jira-js-v3/jira-issue-v3-schema";
import { z } from "zod";

export const mapToJiraIssueModel = (unparsedIssue: object): JiraIssue => {
  const foundIssue = jiraIssueV3Schema.parse(unparsedIssue);

  return {
    key: foundIssue.key,
    id: foundIssue.id,
    summary: foundIssue.fields.summary,
    issueType: foundIssue.fields.issuetype?.name,
    fixVersions: foundIssue.fields.fixVersions.map((version) => ({
      id: version.id,
      name: version.name,
      description: version.description,
      released: version.released,
    })),
    status: foundIssue.fields.status.name,
  };
};

export const JiraJsProjectClientV3 = ({
  key: projectKey,
  id: projectId,
  config: jiraJsClient,
}: JiraProjectClientParams<Version3Client>): IJiraProjectClient<Version3Client> => ({
  key: projectKey,
  id: projectId,
  config: jiraJsClient,
  createIssue: async (params: CreateJiraIssueParams) => {
    const createdIssue = await jiraJsClient.issues.createIssue({
      fields: {
        summary: params.summary,
        issuetype: {
          name: params.issueType,
        },
        project: {
          key: projectKey,
        },
      },
    });

    return mapToJiraIssueModel(createdIssue);
  },
  getIssue: async (issueKey: string) => {
    try {
      const unparsedIssue = await jiraJsClient.issues.getIssue({
        issueIdOrKey: issueKey,
      });
      return mapToJiraIssueModel(unparsedIssue);
    } catch (e) {
      if (e instanceof HttpException) {
        if (e.status === 404) {
          return undefined;
        }
        throw new JiraIssueOperationError(e.message);
      }
      if (e instanceof z.ZodError) {
        throw new JiraIssueOperationError("Jira response incompatible");
      }

      throw new JiraIssueOperationError(e as string);
    }
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
      config: jiraJsClient,
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
        config: jiraJsClient,
      }),
    );
  },
});
