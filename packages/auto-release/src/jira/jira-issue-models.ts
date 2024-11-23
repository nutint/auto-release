import { JiraVersion } from "@/jira/jira-version-models";

export type CreateJiraIssueParams = {
  summary: string;
  description?: string;
  issueType?: string;
};

export type JiraIssueData = CreateJiraIssueParams & {
  status: string;
  fixVersions: JiraVersion[];
};

export type JiraIssue = JiraIssueData & { id: string; key: string };

export class JiraIssueOperationError extends Error {
  constructor(message: string) {
    super(`JiraIssueOperationError: ${message}`);
  }
}
