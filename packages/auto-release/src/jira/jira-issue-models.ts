export type JiraIssueInput = {
  summary: string;
  issueType?: string;
};

export type JiraIssue = JiraIssueInput & { id: string; key: string };
