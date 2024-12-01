import { describe, it, expect } from "vitest";
import { createFormatElementJiraIssueId } from "@/custom-commit-parser/format-element-jira-issue-id";

describe("FormatElementJiraIssueId", () => {
  const { extract } = createFormatElementJiraIssueId();

  describe("extract", () => {
    it("should return issueId as undefined when parse empty string", () => {
      const actual = extract("");

      expect(actual).toEqual({
        jiraIssueId: undefined,
        remainingInput: "",
      });
    });

    it("should return issue id with remaining string when input start with Jira issue id", () => {
      const actual = extract("ABC-123 remainingInput");

      expect(actual).toEqual({
        jiraIssueId: "ABC-123",
        remainingInput: "remainingInput",
      });
    });
  });
});
