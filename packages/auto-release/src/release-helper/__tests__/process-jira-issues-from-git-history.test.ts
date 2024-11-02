import { describe, expect, it } from "vitest";
import {
  extractJiraIssue,
  extractJiraIssues,
} from "@/release-helper/process-jira-issues-from-git-history";

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

  describe("extractJiraIssue", () => {
    const projectKey = "SCRUM";

    describe("contains issueId", () => {
      const stringWithNoIssueId = "do something";
      const inputString = `SCRUM-1 ${stringWithNoIssueId}`;
      it("should extract issueId", () => {
        const actual = extractJiraIssue(inputString, projectKey);

        expect(actual.issueId).toEqual("SCRUM-1");
      });

      it("should get string without issues with replaced issueId", () => {
        const actual = extractJiraIssue(inputString, projectKey);

        expect(actual.issueIdRemoved).toEqual(stringWithNoIssueId);
      });
    });

    describe("contains projectKey with no digit", () => {
      it("should return only stringWithoutIssue when nothing after hyphen(-)", () => {
        const inputString = "SCRUM- do something";

        const actual = extractJiraIssue(inputString, projectKey);

        expect(actual.issueIdRemoved).toEqual(inputString);
      });

      it("should return only stringWithoutIssue", () => {
        const inputString = "SCRUM-abc do something";

        const actual = extractJiraIssue(inputString, projectKey);

        expect(actual.issueIdRemoved).toEqual(inputString);
      });
    });

    describe("valid issue Id format but not the same as project key", () => {
      it("should return issueId as undefined", () => {
        const actual = extractJiraIssue("OTHER-1 do something", projectKey);

        expect(actual.issueId).toBeUndefined();
      });

      it("should return stringWithoutIssue as inputString", () => {
        const actual = extractJiraIssue("OTHER-1 do something", projectKey);

        expect(actual.issueIdRemoved).toEqual("OTHER-1 do something");
      });
    });
  });
});
