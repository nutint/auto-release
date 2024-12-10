import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConfigurationError, processCli } from "../process-cli";
import * as ParseArguments from "@/cli/arguments/parse-arguments";
import * as ReadConfiguration from "@/cli/read-configuration";
import { ValidCommand } from "@/cli/arguments/parse-arguments";
import * as AnalyzeRelease from "@/cli/commands/analyze-release";
import * as Release from "@/cli/commands/release";
import * as CreateJiraRelease from "@/cli/commands/create-jira-release";
import { logger } from "@/logger/logger";
import { LogLevel, OutputFormat } from "@/cli/arguments/common-arguments";

vi.mock("@/cli/parse-arguments");
vi.mock("@/cli/read-configuration");
vi.mock("@/logger/logger");

describe("processCli", () => {
  const mockedParseArgumentsV2 = vi.spyOn(ParseArguments, "parseArgumentsV2");
  const mockedReadConfiguration = vi.spyOn(
    ReadConfiguration,
    "readConfiguration",
  );
  const mockedAnalyzeRelease = vi.spyOn(AnalyzeRelease, "analyzeRelease");
  const mockedRelease = vi.spyOn(Release, "release");
  const mockedLogError = vi.spyOn(logger, "error");

  const interactive = false;
  const outputFormat: OutputFormat = "text";

  const commonArguments = {
    configFile: "auto-release.config.json",
    logLevel: "error" as LogLevel,
    outputFormat,
    interactive,
  };
  const command: ValidCommand = "analyze";

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
    mockedParseArgumentsV2.mockReturnValue({
      command,
      commonArguments,
    });
    mockedReadConfiguration.mockReturnValue(configuration);
    mockedAnalyzeRelease.mockResolvedValue();
    mockedRelease.mockResolvedValue();
  });

  it("should parseArgumentsV2", async () => {
    await processCli(cliArguments);

    expect(mockedParseArgumentsV2).toHaveBeenCalledWith(cliArguments);
  });

  it("should read configuration file", async () => {
    await processCli(cliArguments);

    expect(mockedReadConfiguration).toHaveBeenCalledWith(
      commonArguments.configFile,
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

  describe("release", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      mockedParseArgumentsV2.mockReturnValue({
        commonArguments,
        command: "release",
      });
      mockedRelease.mockResolvedValue();
    });
    it("should release with correct parameters", async () => {
      await processCli(cliArguments);

      expect(mockedRelease).toHaveBeenCalledWith(configuration);
    });
  });

  describe("createJiraRelease", () => {
    const mockedCreateJiraRelease = vi.spyOn(
      CreateJiraRelease,
      "createJiraRelease",
    );

    beforeEach(() => {
      vi.clearAllMocks();
      mockedParseArgumentsV2.mockReturnValue({
        commonArguments,
        command: "create-jira-release",
      });
      mockedCreateJiraRelease.mockResolvedValue();
    });

    it("should log error when there is no jira configuration", async () => {
      mockedCreateJiraRelease.mockRejectedValue(
        new ConfigurationError("missing jiraConfiguration"),
      );

      await processCli(cliArguments);

      expect(mockedLogError).toHaveBeenCalledWith(
        new ConfigurationError("missing jiraConfiguration"),
      );
    });

    it("should create jira release with correct parameters", async () => {
      await processCli(cliArguments);

      expect(mockedCreateJiraRelease).toHaveBeenCalledWith(
        configuration,
        cliArguments,
      );
    });
  });
});
