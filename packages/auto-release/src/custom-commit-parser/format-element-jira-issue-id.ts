import { FormatElementName } from "@/custom-commit-parser/format-element-name";

type JiraIssueIdExtracted = {
  jiraIssueId: string | undefined;
  remainingInput: string;
};

export type FormatElementJiraIssueId = {
  name: FormatElementName.JiraIssueId;
  extract: (input: string) => JiraIssueIdExtracted;
};

export const createFormatElementJiraIssueId = (): FormatElementJiraIssueId => {
  return {
    name: FormatElementName.JiraIssueId,
    extract: (input: string): JiraIssueIdExtracted => {
      const jiraIssueRegex = /^[A-Z]+-\d+/; // Matches Jira issue IDs like "ABC-123"
      const match = input.match(jiraIssueRegex);
      if (!match) {
        return {
          jiraIssueId: undefined,
          remainingInput: input,
        };
      }
      const jiraIssueId = match[0];
      return {
        jiraIssueId,
        remainingInput: input.replace(jiraIssueId, "").trim(),
      };
    },
  };
};
