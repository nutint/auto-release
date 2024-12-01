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

export enum FormatElementName {
  ConventionalCommit = "ConventionalCommit",
  JiraIssueId = "JiraIssueId",
}

type FormatElementConventionalCommit = {
  name: FormatElementName.ConventionalCommit;
};

type FormatElementJiraIssueId = {
  name: FormatElementName.JiraIssueId;
};

type FormatElement = FormatElementConventionalCommit | FormatElementJiraIssueId;
