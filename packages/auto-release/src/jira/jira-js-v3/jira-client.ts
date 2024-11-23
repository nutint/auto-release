import { HttpException, Version3Client } from "jira.js";
import {
  IJiraProjectClient,
  JiraProjectClient,
} from "@/jira/jira-js-v3/jira-project-client";

export type IJiraClient<T> = {
  getProject: (
    projectKey: string,
  ) => Promise<IJiraProjectClient<T> | undefined>;
  _client: T;
};

export const JiraJsV3Client = (
  jiraJsClient: Version3Client,
): IJiraClient<Version3Client> => ({
  getProject: async (
    projectKey: string,
  ): Promise<IJiraProjectClient<Version3Client> | undefined> => {
    try {
      const project = await jiraJsClient.projects.getProject(projectKey);
      return JiraProjectClient({
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
