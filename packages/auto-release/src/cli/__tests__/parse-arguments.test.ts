import { describe, expect, it } from "vitest";
import {
  Arguments,
  defaultConfigurationFile,
  parseArguments,
  mapLogLevel,
  CommandArgument,
  InvalidCommandlineFormat,
  validCommands,
} from "../parse-arguments";

describe("ParseArguments", () => {
  describe("parseArguments", () => {
    const defaultArgument: Arguments = {
      configFile: defaultConfigurationFile,
      logLevel: "error",
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

    it("should return default configuration file when config provide", () => {
      const actual = parseArguments(["analyze"]);

      expect(actual).toEqual(defaultArgument);
    });

    it("should return override configuration file when specify via command line", () => {
      const configurationFileWithOtherName = "auto-release-test.config.json";
      const actual = parseArguments([
        "analyze",
        `--config=${configurationFileWithOtherName}`,
      ]);

      expect(actual).toEqual({
        ...defaultArgument,
        configFile: configurationFileWithOtherName,
      });
    });

    it("should log at warning level with argument --log-level=warn", () => {
      const actual = parseArguments(["analyze", "--log-level=warn"]);

      expect(actual).toEqual({
        ...defaultArgument,
        logLevel: "warn",
      });
    });

    it("should extract analyzing release command", () => {
      const actual = parseArguments(["analyze"]);

      expect(actual).toEqual({
        ...defaultArgument,
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
});
