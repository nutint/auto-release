import { Authentication, JiraConfiguration } from "@/jira/jira-configuration";
import axios from "axios";
import { getUserAgent } from "@/jira/get-server.info";
import { IJiraClient } from "@/jira/jira-client";
import { IJiraProjectClient } from "@/jira/jira-project-client";
import { JiraProjectRestClient } from "@/jira/rest/jira-project-rest-client";
import { JiraRestClientConfig } from "@/jira/rest/jira-rest-client-config";

export const mapToAuthorizationHeader = (authentication: Authentication) =>
  "personalAccessToken" in authentication
    ? `Bearer ${authentication.personalAccessToken}`
    : Buffer.from(
        `${authentication.email}:${authentication.apiToken}`,
      ).toString("base64");

export const JiraRestClient = (
  jiraConfiguration: JiraConfiguration,
): IJiraClient<JiraRestClientConfig> => {
  const { authentication } = jiraConfiguration;
  const authorization = mapToAuthorizationHeader(authentication);
  const config: JiraRestClientConfig = {
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      "User-Agent": getUserAgent(),
    },
  };

  return {
    getProject: async (
      projectKey: string,
    ): Promise<IJiraProjectClient<JiraRestClientConfig>> => {
      const result = await axios.get(
        `${jiraConfiguration.host}/rest/api/2/project/${projectKey}`,
        config,
      );
      const { key, id } = result.data;
      return JiraProjectRestClient({ key, id, config });
    },
    config,
  };
};
