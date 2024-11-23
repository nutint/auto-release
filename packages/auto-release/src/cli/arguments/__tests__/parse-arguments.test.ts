import { describe, expect, it } from "vitest";
import {
  Arguments,
  parseArguments,
  CommandArgument,
  InvalidCommandlineFormat,
  validCommands,
} from "../parse-arguments";
import { defaultConfigurationFile } from "@/cli/arguments/common-arguments";
import { InvalidCreateJiraReleaseCommand } from "@/cli/arguments/create-jira-release-command";

describe("ParseArguments", () => {
  describe("parseArguments", () => {
    const defaultArgument: Arguments = {
      configFile: defaultConfigurationFile,
      logLevel: "error",
      outputFormat: "text",
      interactive: true,
      command: { command: CommandArgument.AnalyzeRelease },
    };

    it("should throw error when there is no command specify", () => {
      expect(() => parseArguments([])).toThrow(
        new InvalidCommandlineFormat("Missing command"),
      );
    });

    it("should throw error when there is invalid command", () => {
      expect(() => parseArguments(["invalidCommand"])).toThrow(
        new InvalidCommandlineFormat(
          `Invalid command, expected one of ${validCommands.join(", ")}`,
        ),
      );
    });

    describe("analyze", () => {
      it("should extract analyzing release command", () => {
        const actual = parseArguments(["analyze"]);

        expect(actual).toEqual(defaultArgument);
      });
    });

    describe("create-jira-release", () => {
      it("should throw error when no jira-project-key", () => {
        expect(() => parseArguments(["create-jira-release"])).toThrow(
          new InvalidCreateJiraReleaseCommand("--jira-project-key required"),
        );
      });

      it("should throw error when has jira-project-key but no value specified", () => {
        expect(() =>
          parseArguments(["create-jira-release", "--jira-project-key="]),
        ).toThrow(
          new InvalidCreateJiraReleaseCommand(
            "missing --jira-project-key value",
          ),
        );
      });

      it("should throw error when has project-key but no version-name specify", () => {
        expect(() =>
          parseArguments(["create-jira-release", "--jira-project-key=SCRUM"]),
        ).toThrow(
          new InvalidCreateJiraReleaseCommand("missing --jira-version-name"),
        );
      });

      it("should throw error when has version name but missing value", () => {
        expect(() =>
          parseArguments([
            "create-jira-release",
            "--jira-project-key=SCRUM",
            "--jira-version-name=",
          ]),
        ).toThrow(
          new InvalidCreateJiraReleaseCommand(
            "missing --jira-version-name value",
          ),
        );
      });

      it("should extract create-jira-release command", () => {
        const actual = parseArguments([
          "create-jira-release",
          "--jira-project-key=SCRUM",
          "--jira-version-name=1.0.1",
        ]);

        expect(actual).toEqual({
          ...defaultArgument,
          command: {
            command: CommandArgument.CreateJiraRelease,
            projectKey: "SCRUM",
            versionName: "1.0.1",
            issues: [],
          },
        });
      });

      it("should extract create-jira-release command with issues with no issue when no issue specified", () => {
        const actual = parseArguments([
          "create-jira-release",
          "--jira-project-key=SCRUM",
          "--jira-version-name=1.0.1",
          "--jira-issues=",
        ]);

        expect(actual).toEqual({
          ...defaultArgument,
          command: {
            command: CommandArgument.CreateJiraRelease,
            projectKey: "SCRUM",
            versionName: "1.0.1",
            issues: [],
          },
        });
      });

      it("should extract create-jira-release command with issues", () => {
        const actual = parseArguments([
          "create-jira-release",
          "--jira-project-key=SCRUM",
          "--jira-version-name=1.0.1",
          "--jira-issues=SCRUM-1,SCRUM-2",
        ]);

        expect(actual).toEqual({
          ...defaultArgument,
          command: {
            command: CommandArgument.CreateJiraRelease,
            projectKey: "SCRUM",
            versionName: "1.0.1",
            issues: ["SCRUM-1", "SCRUM-2"],
          },
        });
      });

      it("should filter issue under the same project key", () => {
        const actual = parseArguments([
          "create-jira-release",
          "--jira-project-key=SCRUM",
          "--jira-version-name=1.0.1",
          "--jira-issues=SCRUM-1,SCRUM-2,OTHER-1",
        ]);

        expect(actual).toEqual({
          ...defaultArgument,
          command: {
            command: CommandArgument.CreateJiraRelease,
            projectKey: "SCRUM",
            versionName: "1.0.1",
            issues: ["SCRUM-1", "SCRUM-2"],
          },
        });
      });
    });
  });
});
