import { parseConventionalMessage } from "@/conventional-commit-helper/conventional-commit-helper";

export const customFormatParser = (format: string, commitMessage: string) => {
  const [jiraIssueId, ...conventionalMessageComponents] =
    commitMessage.split(" ");

  if (jiraIssueId === "") {
    throw new ParseCustomFormatError("missing Jira issue id");
  }

  return {
    jiraIssueId,
    conventionalCommit: parseConventionalMessage(
      conventionalMessageComponents.join(" "),
    ),
  };
};

export class ParseCustomFormatError extends Error {
  constructor(message: string) {
    super(`ParseCustomFormatError: ${message}`);
  }
}
