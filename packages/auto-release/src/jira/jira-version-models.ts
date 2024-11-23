export type TagIssueResult = {
  issueId: string;
  result: string;
  reason?: string;
};

export type JiraVersionInput = {
  name: string;
};

export type JiraVersion = JiraVersionInput & {
  url?: string;
  id: string;
  description?: string;
};
