import { JiraVersion, TagIssueResult } from "@/jira/jira-version-models";

export type IJiraVersionClient<T> = JiraVersion & {
  _client: T;
  setRelease: (release: boolean) => Promise<void>;
  delete: () => Promise<void>;
  tagIssuesFixVersion: (issueIds: string[]) => Promise<TagIssueResult[]>;
};
