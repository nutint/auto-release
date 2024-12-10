import { describe, it, expect } from "vitest";
import {
  InvalidCreateJiraReleaseCommand,
  parseCreateJiraReleaseCommand,
} from "@/cli/arguments/create-jira-release-command";

describe("ParseCreateJiraReleaseCommand", () => {
  describe("parseCreateJiraReleaseCommand", () => {
    const commonArguments = {
      projectKey: "SCRUM",
      versionName: "1.0.1",
    };

    it("should throw --jira-project-key required when not provide --jira-project-key=", () => {
      expect(() => parseCreateJiraReleaseCommand([])).toThrow(
        new InvalidCreateJiraReleaseCommand("--jira-project-key required"),
      );
    });

    it("should throw missing --jira-project-key value when provide argument with no parameters", () => {
      expect(() =>
        parseCreateJiraReleaseCommand(["--jira-project-key="]),
      ).toThrow(
        new InvalidCreateJiraReleaseCommand("missing --jira-project-key value"),
      );
    });

    it("should throw missing --jira-version-name when not provide --jira-version-name", () => {
      expect(() =>
        parseCreateJiraReleaseCommand(["--jira-project-key=SCRUM"]),
      ).toThrow(
        new InvalidCreateJiraReleaseCommand("missing --jira-version-name"),
      );
    });

    it("should throw missing --jira-version-name value when passing --jira-version-name with no value", () => {
      expect(() =>
        parseCreateJiraReleaseCommand([
          "--jira-project-key=SCRUM",
          "--jira-version-name=",
        ]),
      ).toThrow(
        new InvalidCreateJiraReleaseCommand(
          "missing --jira-version-name value",
        ),
      );
    });

    it("should return empty jira issue id when no --jira-issues provided", () => {
      const actual = parseCreateJiraReleaseCommand([
        "--jira-project-key=SCRUM",
        "--jira-version-name=1.0.1",
      ]);

      expect(actual).toEqual({
        ...commonArguments,
        issues: [],
      });
    });

    it("should return no issues when provide --jira-issues with no issues", () => {
      const actual = parseCreateJiraReleaseCommand([
        "--jira-project-key=SCRUM",
        "--jira-version-name=1.0.1",
        "--jira-issues=",
      ]);

      expect(actual).toEqual({
        ...commonArguments,
        issues: [],
      });
    });

    it("should return issues when provide --jira-issues", () => {
      const actual = parseCreateJiraReleaseCommand([
        "--jira-project-key=SCRUM",
        "--jira-version-name=1.0.1",
        "--jira-issues=SCRUM-1,SCRUM-3",
      ]);

      expect(actual).toEqual({
        ...commonArguments,
        issues: ["SCRUM-1", "SCRUM-3"],
      });
    });
  });
});
