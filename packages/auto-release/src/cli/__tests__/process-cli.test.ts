import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConfigurationError, processCli } from "../process-cli";
import * as ParseArguments from "@/cli/parse-arguments";
import * as ReadConfiguration from "@/cli/read-configuration";
import { Arguments, CommandArgument } from "@/cli/parse-arguments";
import * as AnalyzeRelease from "@/cli/commands/analyze-release";
import * as CreateJiraRelease from "@/cli/commands/create-jira-release";

vi.mock("@/cli/parse-arguments");
vi.mock("@/cli/read-configuration");

describe("processCli", () => {
  const mockedParseArguments = vi.spyOn(ParseArguments, "parseArguments");
  const mockedReadConfiguration = vi.spyOn(
    ReadConfiguration,
    "readConfiguration",
  );
  const mockedAnalyzeRelease = vi.spyOn(AnalyzeRelease, "analyzeRelease");

  const interactive = false;
  const outputFormat = "text";

  const parsedArguments: Arguments = {
    configFile: "auto-release.config.json",
    logLevel: "error",
    outputFormat,
    interactive,
    command: { command: CommandArgument.AnalyzeRelease },
  };

  const jiraConfiguration = {
    host: "https://yourdomain.jira.com",
    authentication: {
      email: "youremail@email.com",
      apiToken: "apiToken",
    },
  };

  const configuration = {
    versionSource: {
      versionFile: "/abc/build.sbt",
    },
    jiraConfiguration,
  };

  const cliArguments: string[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    mockedParseArguments.mockReturnValue(parsedArguments);
    mockedReadConfiguration.mockReturnValue(configuration);
    mockedAnalyzeRelease.mockResolvedValue();
  });

  it("should parse cliArguments", async () => {
    await processCli(cliArguments);

    expect(mockedParseArguments).toHaveBeenCalledWith(cliArguments);
  });

  it("should read configuration file", async () => {
    await processCli(cliArguments);

    expect(mockedReadConfiguration).toHaveBeenCalledWith(
      parsedArguments.configFile,
    );
  });

  describe("analyzeRelease", () => {
    it("should analyze release information with correct parameters", async () => {
      await processCli(cliArguments);

      expect(mockedAnalyzeRelease).toHaveBeenCalledWith(
        configuration.versionSource,
        { interactive, outputFormat },
      );
    });
  });

  describe("createJiraRelease", () => {
    const mockedCreateJiraRelease = vi.spyOn(
      CreateJiraRelease,
      "createJiraRelease",
    );

    const projectKey = "SCRUM";
    const versionName = "1.0.1";

    beforeEach(() => {
      vi.clearAllMocks();
      mockedParseArguments.mockReturnValue({
        ...parsedArguments,
        command: {
          command: "CreateJiraRelease",
          projectKey,
          versionName,
        },
      });
      mockedCreateJiraRelease.mockResolvedValue();
    });

    it("should throw error when there is no jira configuration", async () => {
      mockedReadConfiguration.mockReturnValue({
        ...configuration,
        jiraConfiguration: undefined,
      });

      await expect(() => processCli(cliArguments)).rejects.toEqual(
        new ConfigurationError("missing jiraConfiguration"),
      );
    });

    it("should create jira release with correct parameters", async () => {
      await processCli(cliArguments);

      expect(mockedCreateJiraRelease).toHaveBeenCalledWith(
        jiraConfiguration,
        projectKey,
        versionName,
        [],
      );
    });
  });
});
