import { FormatElementName } from "@/custom-commit-parser/format-element-name";
import { Extractor } from "@/custom-commit-parser/extractor";

export type FormatElementJiraIssueId = {
  name: FormatElementName.JiraIssueId;
  key: "jiraIssueId";
} & Extractor<string>;

export const createFormatElementJiraIssueId = (): FormatElementJiraIssueId => {
  return {
    name: FormatElementName.JiraIssueId,
    key: "jiraIssueId",
    extract: (input: string) => {
      const jiraIssueRegex = /^[A-Z]+-\d+/; // Matches Jira issue IDs like "ABC-123"
      const match = input.match(jiraIssueRegex);
      if (!match) {
        return {
          value: undefined,
          remainingInput: input,
        };
      }
      const jiraIssueId = match[0];
      return {
        value: jiraIssueId,
        remainingInput: input.replace(jiraIssueId, "").trim(),
      };
    },
  };
};
