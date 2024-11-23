import { Authentication, JiraConfiguration } from "@/jira/jira-configuration";
import { IJiraClient } from "@/jira/jira-js-v3/jira-client";
import axios, { Axios } from "axios";
import { IJiraProjectClient } from "@/jira/jira-js-v3/jira-project-client";
import { getUserAgent } from "@/jira/get-server.info";

export const mapToAuthorizationHeader = (authentication: Authentication) =>
  "personalAccessToken" in authentication
    ? `Bearer ${authentication.personalAccessToken}`
    : Buffer.from(
        `${authentication.email}:${authentication.apiToken}`,
      ).toString("base64");

export const JiraServerClient = (
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
