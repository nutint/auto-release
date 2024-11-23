import { describe, expect, it } from "vitest";
import {
  defaultConfigurationFile,
  InvalidCommandLineOutputFormat,
  mapLogLevel,
  parseCommonArguments,
  validOutputFormats,
} from "@/cli/arguments/common-arguments";

describe("CommonArguments", () => {
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
