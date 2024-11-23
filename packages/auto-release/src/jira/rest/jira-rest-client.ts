import { Authentication, JiraConfiguration } from "@/jira/jira-configuration";
import axios, { Axios } from "axios";
import { getUserAgent } from "@/jira/get-server.info";
import { IJiraClient } from "@/jira/jira-client";
import { IJiraProjectClient } from "@/jira/jira-project-client";

export const mapToAuthorizationHeader = (authentication: Authentication) =>
  "personalAccessToken" in authentication
    ? `Bearer ${authentication.personalAccessToken}`
    : Buffer.from(
        `${authentication.email}:${authentication.apiToken}`,
      ).toString("base64");

export const JiraRestClient = (
  jiraConfiguration: JiraConfiguration,
): IJiraClient<Axios> => {
  return {
    getProject: async (
      projectKey: string,
    ): Promise<IJiraProjectClient<Axios>> => {
      const { authentication } = jiraConfiguration;
      const authorization = mapToAuthorizationHeader(authentication);

      const result = await axios.get(
        `${jiraConfiguration.host}/rest/api/2/project/${projectKey}`,
        {
          headers: {
            Authorization: authorization,
            "Content-Type": "application/json",
            "User-Agent": getUserAgent(),
          },
        },
      );
      const { key, id } = result.data;
      return {
        key,
        id,
        _client: axios,
      } as unknown as IJiraProjectClient<Axios>;
    },
  } as unknown as IJiraClient<Axios>;
};
