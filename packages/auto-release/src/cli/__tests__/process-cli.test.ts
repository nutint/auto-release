import { describe, it, expect, vi, beforeEach } from "vitest";
import { processCli } from "../process-cli";
import * as ParseArguments from "@/cli/parse-arguments";
import * as ReadConfiguration from "@/cli/read-configuration";
import { Arguments } from "@/cli/parse-arguments";

vi.mock("@/cli/parse-arguments");
vi.mock("@/cli/read-configuration");

describe("processCli", () => {
  const mockedParseArguments = vi.spyOn(ParseArguments, "parseArguments");
  const mockedReadConfiguration = vi.spyOn(
    ReadConfiguration,
    "readConfiguration",
  );

  const parsedArguments: Arguments = {
    configFile: "auto-release.config.json",
    logLevel: "error",
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
});
