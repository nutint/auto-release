import { describe, it, expect } from "vitest";
import { FormatSyntaxError, formatSyntaxParser } from "../format-syntax-parser";
import { FormatElementName } from "@/custom-commit-parser/format-element-name";

describe("FormatSyntaxParser", () => {
  describe("formatSyntaxParser", () => {
    it("should throw error when no valid element", () => {
      const commitFormat = "{{invalidElement}}";
      expect(() => formatSyntaxParser(commitFormat)).toThrow(
        new FormatSyntaxError(`invalid commit format (${commitFormat})`),
      );
    });

    it("should throw error when conventional commits is not the last element", () => {
      expect(() =>
        formatSyntaxParser("{{conventionalCommit}} {{jiraIssueId}}"),
      ).toThrow(
        new FormatSyntaxError("conventionalCommit must be last element"),
      );
    });

    it("should return FormatElementConventionalCommit when contains only conventional commits", () => {
      const actual = formatSyntaxParser("{{conventionalCommit}}");

      expect(actual.map(({ name }) => name)).toEqual([
        FormatElementName.ConventionalCommit,
      ]);
    });

    it("should return only FormatElementJiraIssueId when contains only Jira issue id", () => {
      const actual = formatSyntaxParser("{{jiraIssueId}}");

      expect(actual.map(({ name }) => name)).toEqual([
        FormatElementName.JiraIssueId,
      ]);
    });
  });
});
