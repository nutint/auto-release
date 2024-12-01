import { describe, expect, it } from "vitest";
import { customFormatParser } from "../custom-format-parser";
import { parseConventionalMessage } from "@/conventional-commit-helper/conventional-commit-helper";

describe("CustomFormatParser", () => {
  const customFormat = "{{jiraIssueId}} {{conventionalCommit}}";
  const conventionalMessage = `feat: do some feature`;
  const jiraIssueId = `ABC-123`;
  const commitMessage = `${jiraIssueId} ${conventionalMessage}`;

  it("should extract jira issue id with conventional commits", () => {
    const actual = customFormatParser(customFormat, commitMessage);

    expect(actual).toEqual({
      jiraIssueId,
      conventionalCommit: parseConventionalMessage(conventionalMessage),
    });
  });
});
