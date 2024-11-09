import { describe, it, expect, vi, beforeEach } from "vitest";
import { processCli } from "../process-cli";
import * as ParseArguments from "@/cli/parse-arguments";
import * as ReadConfiguration from "@/cli/read-configuration";
import { Arguments, CommandArgument } from "@/cli/parse-arguments";
import * as AnalyzeRelease from "@/cli/commands/analyze-release";

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

  const configuration = {
    versionSource: {
      versionFile: "/abc/build.sbt",
    },
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

  it("should analyze release information with correct parameters", async () => {
    await processCli(cliArguments);

    expect(mockedAnalyzeRelease).toHaveBeenCalledWith(
      configuration.versionSource,
      { interactive, outputFormat },
    );
  });
});
