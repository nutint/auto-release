import { JiraIssue, CreateJiraIssueParams } from "@/jira/jira-issue-models";
import { JiraVersionInput } from "@/jira/jira-version-models";
import { IJiraVersionClient } from "@/jira/jira-version-client";
import { JiraClientConfig } from "@/jira/jira-client-config";

export type IJiraProjectClient<T> = {
  key: string;
  id: string;
  createIssue: (input: CreateJiraIssueParams) => Promise<JiraIssue>;
  getIssue: (issueKey: string) => Promise<JiraIssue | undefined>;
  createVersion: (input: JiraVersionInput) => Promise<IJiraVersionClient<T>>;
  getVersions: () => Promise<IJiraVersionClient<T>[]>;
} & JiraClientConfig<T>;

export type JiraProjectClientParams<T> = {
  key: string;
  id: string;
} & JiraClientConfig<T>;
