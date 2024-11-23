import {
  IJiraProjectClient,
  JiraProjectClientParams,
} from "@/jira/jira-project-client";
import { JiraRestClientConfig } from "@/jira/rest/jira-rest-client-config";
import axios, { AxiosError } from "axios";
import { JiraIssueOperationError } from "@/jira/jira-issue-models";
import { jiraIssueSchema } from "@/jira/rest/jira-issue.schema";
import { z } from "zod";

export const JiraProjectRestClient = ({
  key: projectKey,
  id: projectId,
  config,
}: JiraProjectClientParams<JiraRestClientConfig>): IJiraProjectClient<JiraRestClientConfig> => {
  return {
    key: projectKey,
    id: projectId,
    config,
    getIssue: async (issueKey: string) => {
      try {
        const response = await axios.get(
          `${config.host}/rest/api/2/issue/${issueKey}`,
          config.axiosRequestConfig,
        );
        const { id, fields } = jiraIssueSchema.parse(response.data);
        const { summary, fixVersions, status, issuetype } = fields;
        return {
          id,
          key: issueKey,
          summary,
          fixVersions: fixVersions.map((version) => ({
            id: version.id,
            name: version.name,
            description: version.description,
            released: version.released,
          })),
          status: status.name,
          issueType: issuetype.name,
        };
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.code === "404") {
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
  } as any;
};
