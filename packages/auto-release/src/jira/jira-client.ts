import { IJiraProjectClient } from "@/jira/jira-project-client";
import { JiraClientConfig } from "@/jira/jira-client-config";

export type IJiraClient<T> = JiraClientConfig<T> & {
  getProject: (
    projectKey: string,
  ) => Promise<IJiraProjectClient<T> | undefined>;
};
