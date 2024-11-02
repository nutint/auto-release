import { describe, expect, it } from "vitest";
import { extractJiraIssues } from "@/release-helper/process-jira-issues-from-git-history";

describe("ProcessJiraIssuesFromGitHistory", () => {
  describe("extractJiraIssues", () => {
    const input =
      "this is a string with relevant jira issue SCRUM-123, ABC-123";

    it("should return empty array when no project key specified", () => {
      const actual = extractJiraIssues(input, []);

      expect(actual.issues).toEqual([]);
    });

    it("should return empty array when there is no matched issue in the input string", () => {
      const actual = extractJiraIssues(input, ["DEF"]);

      expect(actual.issues).toEqual([]);
    });

    it("should return matched issue when one project code match with 1 issue", () => {
      const actual = extractJiraIssues(input, ["SCRUM"]);

      expect(actual.issues).toEqual(["SCRUM-123"]);
    });

    it("should return matched issues when two of project keys are matched", () => {
      const actual = extractJiraIssues(input, ["SCRUM", "ABC"]);

      expect(actual.issues).toEqual(["SCRUM-123", "ABC-123"]);
    });

    it("should return matched issue if any issue in the string contains project key but has string after -", () => {
      const actual = extractJiraIssues("ABC-123 with ABC-Something else", [
        "ABC",
      ]);

      expect(actual.issues).toEqual(["ABC-123"]);
    });

    it("should return matched issue if any issue in the string contains project key but no number", () => {
      const actual = extractJiraIssues("ABC-123 with ABC-", ["ABC"]);

      expect(actual.issues).toEqual(["ABC-123"]);
    });

    it("should expose function that remove all jira issues from the original string", () => {
      const actual = extractJiraIssues(input, ["SCRUM", "ABC"]);

      expect(actual.stringWithoutIssues()).toEqual(
        "this is a string with relevant jira issue ,",
      );
    });
  });
});
