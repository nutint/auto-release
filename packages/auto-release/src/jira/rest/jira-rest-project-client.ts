import {
  IJiraProjectClient,
  JiraProjectClientParams,
} from "@/jira/jira-project-client";
import { JiraRestClientConfig } from "@/jira/rest/jira-rest-client-config";
import axios, { AxiosError } from "axios";
import {
  CreateJiraIssueParams,
  JiraIssueOperationError,
} from "@/jira/jira-issue-models";
import { jiraIssueSchema } from "@/jira/rest/jira-issue.schema";
import { z } from "zod";
import {
  JiraVersionInput,
  JiraVersionOperationError,
} from "@/jira/jira-version-models";
import { JiraRestVersionClient } from "@/jira/rest/jira-rest-version-client";
import { jiraVersionSchema } from "@/jira/rest/jira-version-schema";
import { logger } from "@/logger/logger";

export const JiraRestProjectClient = ({
  key: projectKey,
  id: projectId,
  config,
}: JiraProjectClientParams<JiraRestClientConfig>): IJiraProjectClient<JiraRestClientConfig> => {
  return {
    key: projectKey,
    id: projectId,
    config,
    createIssue: async (createIssueParams: CreateJiraIssueParams) => {
      throw new JiraIssueOperationError("unimplemented");
    },
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
            projectKey: projectKey,
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
    createVersion: async (createVersionParams: JiraVersionInput) => {
      try {
        const response = await axios.post(
          `${config.host}/rest/api/2/version`,
          {
            project: projectKey,
            name: createVersionParams.name,
          },
          config.axiosRequestConfig,
        );

        const { id, name, description, released } = jiraVersionSchema.parse(
          response.data,
        );

        return JiraRestVersionClient({
          id,
          name,
          description,
          projectKey,
          released,
          config,
        });
      } catch (e) {
        if (e instanceof z.ZodError) {
          throw new JiraVersionOperationError("Jira response incompatible");
        }
        logger.error("create version failed:", e);
        throw new JiraVersionOperationError(e as string);
      }
    },
    getVersions: async () => {
      try {
        const response = await axios.get(
          `${config.host}/rest/projects/1.0/project/${projectKey}/release/allversions-nodetails`,
          config.axiosRequestConfig,
        );
        const versions = z.array(jiraVersionSchema).parse(response.data);
        return versions.map((version) =>
          JiraRestVersionClient({
            id: version.id,
            name: version.name,
            projectKey: projectKey,
            description: version.description,
            released: version.released,
            config,
          }),
        );
      } catch (e) {
        if (e instanceof z.ZodError) {
          logger.error("get versions failed: validation error");
          throw new JiraVersionOperationError("Jira response incompatible");
        }
        throw new JiraVersionOperationError(e as string);
      }
    },
  };
};
