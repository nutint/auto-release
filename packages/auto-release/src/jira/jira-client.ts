import { IJiraProjectClient } from "@/jira/jira-project-client";

export type IJiraClient<T> = {
  getProject: (
    projectKey: string,
  ) => Promise<IJiraProjectClient<T> | undefined>;
  _client: T;
};
