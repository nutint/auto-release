import { describe, expect, it } from "vitest";
import {
  Arguments,
  defaultConfigurationFile,
  parseArguments,
  mapLogLevel,
} from "../parse-arguments";

describe("ParseArguments", () => {
  describe("parseArguments", () => {
    const defaultArgument: Arguments = {
      configFile: defaultConfigurationFile,
      logLevel: "error",
    };

    it("should return default configuration file when no argument", () => {
      const actual = parseArguments([]);

      expect(actual).toEqual(defaultArgument);
    });

    it("should return override configuration file when specify via command line", () => {
      const configurationFileWithOtherName = "auto-release-test.config.json";
      const actual = parseArguments([
        `--config=${configurationFileWithOtherName}`,
      ]);

      expect(actual).toEqual({
        ...defaultArgument,
        configFile: configurationFileWithOtherName,
      });
    });

    it("should log at warning level with argument --log-level=warn", () => {
      const actual = parseArguments(["--log-level=warn"]);

      expect(actual).toEqual({
        ...defaultArgument,
        logLevel: "warn",
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
