import { describe, expect, it } from "vitest";
import { customFormatParser } from "../custom-format-parser";
import { parseConventionalMessage } from "@/conventional-commit-helper/conventional-commit-helper";
import { FormatElementName } from "@/custom-commit-parser/format-element-name";
import { formatSyntaxParser } from "@/custom-commit-parser/format-syntax-parser";

describe("CustomFormatParser", () => {
  describe("customFormatParser", () => {
    const customFormat = "{{jiraIssueId}} {{conventionalCommit}}";
    const conventionalMessage = `feat: do some feature`;
    const jiraIssueId = `ABC-123`;
    const commitMessage = `${jiraIssueId} ${conventionalMessage}`;

    const extractedFormat = formatSyntaxParser(customFormat);

    it("should extract jira issue id with conventional commits", () => {
      const actual = customFormatParser(extractedFormat, commitMessage);

      expect(actual).toEqual([
        { name: FormatElementName.JiraIssueId, value: jiraIssueId },
        {
          name: FormatElementName.ConventionalCommit,
          value: parseConventionalMessage(conventionalMessage),
        },
      ]);
    });
  });
});
