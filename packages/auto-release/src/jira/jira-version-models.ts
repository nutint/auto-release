export type TagIssueResult = {
  issueId: string;
  result: string;
  reason?: string;
};

export type JiraVersionInput = {
  name: string;
};

export type JiraVersion = {
  id: string;
  projectKey: string;
  name: string;
  description?: string;
  released: boolean;
};

export class JiraVersionOperationError extends Error {
  constructor(message: string) {
    super(`JiraVersionOperationError: ${message}`);
  }
}
