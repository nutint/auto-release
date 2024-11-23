import { HttpException, Version3Client } from "jira.js";
import { JiraJsProjectClientV3 } from "@/jira/jira-js-v3/jira-js-project-client-v3";
import { IJiraClient } from "@/jira/jira-client";
import { IJiraProjectClient } from "@/jira/jira-project-client";
import { JiraConfiguration } from "@/jira/jira-configuration";

export const JiraJsClientV3 = (
  configuration: JiraConfiguration,
): IJiraClient<Version3Client> => {
  const { host, authentication } = configuration;
  const jiraJsClient = new Version3Client({
    host,
    authentication:
      "personalAccessToken" in authentication
        ? { personalAccessToken: authentication.personalAccessToken }
        : {
            basic: {
              email: authentication.email,
              apiToken: authentication.apiToken,
            },
          },
    baseRequestConfig: {
      headers: {
        "Content-Type": "application/json",
      },
    },
  });
  return {
    getProject: async (
      projectKey: string,
    ): Promise<IJiraProjectClient<Version3Client> | undefined> => {
      try {
        const project = await jiraJsClient.projects.getProject(projectKey);
        return JiraJsProjectClientV3({
          key: project.key,
          id: project.id,
          config: jiraJsClient,
        });
      } catch (e) {
        if (e instanceof HttpException) {
          if (e.status === 404) {
            return undefined;
          }
        }
        throw new Error("Get project failed");
      }
    },
    config: jiraJsClient,
  };
};
