import { FormatElementName } from "@/custom-commit-parser/format-element-name";
import { FormatElementConventionalCommit } from "@/custom-commit-parser/format-element-conventional-commit";
import { FormatElementJiraIssueId } from "@/custom-commit-parser/format-element-jira-issue-id";

export const formatSyntaxParser = (commitFormat: string): FormatElement[] => {
  const elements = commitFormat.split(" ");
  const conventionalCommitFormat = {
    name: FormatElementName.ConventionalCommit,
  };
  const formatElements = elements.map((element) =>
    element === "{{conventionalCommit}}"
      ? conventionalCommitFormat
      : { name: FormatElementName.JiraIssueId },
  );
  if (
    formatElements.length > 1 &&
    formatElements[formatElements.length - 1] !== conventionalCommitFormat
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
