import { Version3Client } from "jira.js";

export type JiraVersionInput = {
  name: string;
};

export type JiraVersion = JiraVersionInput & {
  url?: string;
  id?: string;
  description?: string;
};
export type IJiraVersionClient<T> = JiraVersion & {};

export const JiraVersionClient = (
  jiraVersion: JiraVersion,
): IJiraVersionClient<Version3Client> => {
  return {
    name: jiraVersion.name,
    url: jiraVersion.url,
    id: jiraVersion.id,
    description: jiraVersion.description,
  };
};
