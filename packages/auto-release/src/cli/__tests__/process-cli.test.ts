import { describe, it, expect, vi, beforeEach } from "vitest";
import { processCli } from "../process-cli";
import * as ParseArguments from "@/cli/parse-arguments";
import * as ReadConfiguration from "@/cli/read-configuration";
import * as ReleaseHelper from "@/release-helper/release-helper";
import { Arguments, CommandArgument } from "@/cli/parse-arguments";

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
    commands: [],
  };

  const configuration = {
    foo: "bar",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedParseArguments.mockReturnValue(parsedArguments);
  });

  it("should parse arguments", async () => {
    await processCli([]);

    expect(mockedParseArguments).toHaveBeenCalledWith([]);
  });

  it("should read configuration file", async () => {
    await processCli([]);

    expect(mockedReadConfiguration).toHaveBeenCalledWith(
      parsedArguments.configFile,
    );
  });

  it("should extract release information when user passed analyze release command", async () => {
    mockedParseArguments.mockReturnValue({
      ...parsedArguments,
      commands: [{ command: CommandArgument.AnalyzeRelease }],
    });

    await processCli(["--analyze-release"]);

    expect(mockedExtractReleaseInformation).toHaveBeenCalled();
  });

  it("should not extract release information when user not pass analyze release command", async () => {
    await processCli(["--analyze-release"]);

    expect(mockedExtractReleaseInformation).not.toHaveBeenCalled();
  });
});
