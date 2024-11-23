import { HttpException, Version3Client } from "jira.js";
import { JiraJsProjectClientV3 } from "@/jira/jira-js-v3/jira-js-project-client-v3";
import { IJiraClient } from "@/jira/jira-client";
import { IJiraProjectClient } from "@/jira/jira-project-client";

export const JiraJsClientV3 = (
  jiraJsClient: Version3Client,
): IJiraClient<Version3Client> => ({
  getProject: async (
    projectKey: string,
  ): Promise<IJiraProjectClient<Version3Client> | undefined> => {
    try {
      const project = await jiraJsClient.projects.getProject(projectKey);
      return JiraJsProjectClientV3({
        key: project.key,
        id: project.id,
        jiraJsClient,
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
  _client: jiraJsClient,
});
