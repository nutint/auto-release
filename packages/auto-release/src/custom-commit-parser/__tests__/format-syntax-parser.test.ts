import { describe, it, expect } from "vitest";
import {
  FormatElementName,
  FormatSyntaxError,
  formatSyntaxParser,
} from "../format-syntax-parser";

describe("FormatSyntaxParser", () => {
  describe("formatSyntaxParser", () => {
    it("should throw error when conventional commits is not the last element", () => {
      expect(() =>
        formatSyntaxParser("{{conventionalCommit}} {{jiraIssueId}}"),
      ).toThrow(
        new FormatSyntaxError("conventionalCommit must be last element"),
      );
    });

    it("should return FormatElementConventionalCommit when contains only conventional commits", () => {
      const actual = formatSyntaxParser("{{conventionalCommit}}");

      expect(actual).toEqual([{ name: FormatElementName.ConventionalCommit }]);
    });

    it("should return only FormatElementJiraIssueId when contains only Jira issue id", () => {
      const actual = formatSyntaxParser("{{jiraIssueId}}");

      expect(actual).toEqual([{ name: FormatElementName.JiraIssueId }]);
    });
  });
});
