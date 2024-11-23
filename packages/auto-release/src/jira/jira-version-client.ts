import { JiraVersion, TagIssueResult } from "@/jira/jira-version-models";
import { JiraClientConfig } from "@/jira/jira-client-config";

export type IJiraVersionClient<T> = JiraVersion & {
  setRelease: (release: boolean) => Promise<void>;
  delete: () => Promise<void>;
  tagIssuesFixVersion: (issueIds: string[]) => Promise<TagIssueResult[]>;
} & JiraClientConfig<T>;
