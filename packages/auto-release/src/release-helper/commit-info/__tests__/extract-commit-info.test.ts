import { describe, expect, it } from "vitest";
import {
  extractCommitInfo,
  ExtractCommitInfoError,
} from "../extract-commit-info";
import { FormatElementName } from "@/custom-commit-parser/format-element-name";

describe("ExtractCommitInfo", () => {
  describe("extractCommitInfo", () => {
    it("should throw error no information provided", () => {
      expect(() => extractCommitInfo([])).toThrow(
        new ExtractCommitInfoError("no information provided"),
      );
    });

    it("should throw error when no message provided", () => {
      expect(() =>
        extractCommitInfo([
          { name: FormatElementName.JiraIssueId, value: undefined },
        ]),
      ).toThrow(new ExtractCommitInfoError("missing commit subject"));
    });

    it("should return jira issue id with content of conventional commit if it no breaking change", () => {
      const actual = extractCommitInfo([
        { name: FormatElementName.JiraIssueId, value: "ABC-123" },
        {
          name: FormatElementName.ConventionalCommit,
          value: {
            type: "feat",
            subject: "this is the subject",
            header: "feat: this is the subject",
            notes: [],
          },
        },
      ]);

      expect(actual).toEqual({
        type: "feat",
        scope: undefined,
        subject: "this is the subject",
        jiraIssueId: "ABC-123",
        breakingChange: false,
      });
    });

    it("should return jira issue id with content of conventional commit if it has breaking change", () => {
      const actual = extractCommitInfo([
        { name: FormatElementName.JiraIssueId, value: "ABC-123" },
        {
          name: FormatElementName.ConventionalCommit,
          value: {
            type: "feat",
            subject: "this is the subject",
            header: "feat: this is the subject",
            notes: [{ title: "BREAKING CHANGE", text: "" }],
          },
        },
      ]);

      expect(actual).toEqual({
        type: "feat",
        scope: undefined,
        subject: "this is the subject",
        jiraIssueId: "ABC-123",
        breakingChange: true,
      });
    });
  });
});
