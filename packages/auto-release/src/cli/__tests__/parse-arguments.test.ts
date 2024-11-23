import { describe, expect, it } from "vitest";
import {
  Arguments,
  defaultConfigurationFile,
  parseArguments,
  mapLogLevel,
  CommandArgument,
  InvalidCommandlineFormat,
  validCommands,
  validOutputFormats,
  InvalidCommandLineOutputFormat,
  InvalidCreateJiraReleaseCommand,
  parseCommonArguments,
} from "../parse-arguments";

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

  describe("mapLogLevel", () => {
    it("should return undefined when input is not valid log level name", () => {
      const actual = mapLogLevel("otherLogLevel");

      expect(actual).toBeUndefined();
    });

    it.each([
      ["error", "error"],
      ["warn", "warn"],
      ["info", "info"],
      ["debug", "debug"],
    ])("should return %s, when input is %s", (input, expected) => {
      const actual = mapLogLevel(input);

      expect(actual).toEqual(expected);
    });
  });

  describe("parseCommonArguments", () => {
    it("should return default configuration file when no config provide", () => {
      const actual = parseCommonArguments([]);

      expect(actual.configFile).toEqual(defaultConfigurationFile);
    });

    it("should return override configuration file when specify via command line", () => {
      const configurationFileWithOtherName = "auto-release-test.config.json";
      const actual = parseCommonArguments([
        `--config=${configurationFileWithOtherName}`,
      ]);

      expect(actual.configFile).toEqual(configurationFileWithOtherName);
    });

    it("should throw error when output format is not json and text", () => {
      expect(() => parseCommonArguments(["--output-format=other"])).toThrow(
        new InvalidCommandLineOutputFormat(
          `expect output format one of [${validOutputFormats.join(", ")}]`,
        ),
      );
    });

    it("should return outputFormat as Json if specify output format as json", () => {
      const actual = parseCommonArguments(["--output-format=json"]);

      expect(actual.outputFormat).toEqual("json");
    });

    it("should log at warning level with argument --log-level=warn", () => {
      const actual = parseCommonArguments(["--log-level=warn"]);

      expect(actual.logLevel).toEqual("warn");
    });

    it("should have interactive as false when --no-interactive flag provided", () => {
      const actual = parseCommonArguments(["analyze", "--no-interactive"]);

      expect(actual.interactive).toEqual(false);
    });

    it("should have valid default value when nothing provided", () => {
      const actual = parseCommonArguments([]);

      expect(actual).toEqual({
        configFile: defaultConfigurationFile,
        logLevel: "error",
        outputFormat: "text",
        interactive: true,
      });
    });
  });
});
