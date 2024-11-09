import { describe, it, expect, vi, beforeEach } from "vitest";
import { processCli } from "../process-cli";
import * as ParseArguments from "@/cli/parse-arguments";
import * as ReadConfiguration from "@/cli/read-configuration";
import * as ReleaseHelper from "@/release-helper/release-helper";
import { Arguments, CommandArgument } from "@/cli/parse-arguments";
import { ReleaseInformation } from "@/release-helper/release-helper";

vi.mock("@/cli/parse-arguments");
vi.mock("@/cli/read-configuration");

describe("processCli", () => {
  const mockedParseArguments = vi.spyOn(ParseArguments, "parseArguments");
  const mockedReadConfiguration = vi.spyOn(
    ReadConfiguration,
    "readConfiguration",
  );
  const mockedExtractReleaseInformation = vi.spyOn(
    ReleaseHelper,
    "extractReleaseInformation",
  );

  const parsedArguments: Arguments = {
    configFile: "auto-release.config.json",
    logLevel: "error",
    command: { command: CommandArgument.AnalyzeRelease },
  };

  const configuration = {
    versionSource: {
      versionFile: "/abc/build.sbt",
    },
  };

  const releaseInformation = {
    foo: "bar",
  } as unknown as ReleaseInformation;

  const cliArguments: string[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    mockedParseArguments.mockReturnValue(parsedArguments);
    mockedReadConfiguration.mockReturnValue(configuration);
    mockedExtractReleaseInformation.mockResolvedValue(releaseInformation);
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

  it("should extract release information when user passed analyze release command", async () => {
    mockedParseArguments.mockReturnValue(parsedArguments);

    await processCli(cliArguments);

    expect(mockedExtractReleaseInformation).toHaveBeenCalledWith(
      configuration.versionSource,
    );
  });
});
