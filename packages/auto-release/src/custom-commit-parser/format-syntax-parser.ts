import { FormatElementName } from "@/custom-commit-parser/format-element-name";
import {
  createFormatElementConventionalCommit,
  FormatElementConventionalCommit,
} from "@/custom-commit-parser/format-element-conventional-commit";
import {
  createFormatElementJiraIssueId,
  FormatElementJiraIssueId,
} from "@/custom-commit-parser/format-element-jira-issue-id";

export const formatSyntaxParser = (commitFormat: string): FormatElement[] => {
  const elements = commitFormat.split(" ");
  const formatElements: FormatElement[] = elements.flatMap((element) => {
    switch (element) {
      case "{{conventionalCommit}}":
        return [createFormatElementConventionalCommit()];
      case "{{jiraIssueId}}":
        return [createFormatElementJiraIssueId()];
      default:
        return [] as FormatElement[];
    }
  });

  if (formatElements.length == 0) {
    throw new FormatSyntaxError(`invalid commit format (${commitFormat})`);
  }
  if (
    formatElements.length > 1 &&
    formatElements[formatElements.length - 1]!.name !==
      FormatElementName.ConventionalCommit
  ) {
    throw new FormatSyntaxError("conventionalCommit must be last element");
  }

  return formatElements;
};

export class FormatSyntaxError extends Error {
  constructor(message: string) {
    super(`FormatSyntaxParser: ${message}`);
  }
}

type FormatElement = FormatElementConventionalCommit | FormatElementJiraIssueId;
