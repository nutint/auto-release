import { describe, expect, it } from "vitest";
import {
  InvalidCommandlineFormat,
  validCommands,
  parseArgumentsV2,
} from "../parse-arguments";
import {
  CommonArguments,
  defaultConfigurationFile,
} from "@/cli/arguments/common-arguments";

describe("ParseArguments", () => {
  const commonArguments: CommonArguments = {
    configFile: defaultConfigurationFile,
    logLevel: "error",
    outputFormat: "text",
    interactive: true,
  };

  describe("parseArgumentsV2", () => {
    it("should throw error when there is no command specify", () => {
      expect(() => parseArgumentsV2([])).toThrow(
        new InvalidCommandlineFormat("Missing command"),
      );
    });

    it("should throw error when there is invalid command", () => {
      expect(() => parseArgumentsV2(["invalidCommand"])).toThrow(
        new InvalidCommandlineFormat(
          `Invalid command, expected one of ${validCommands.join(", ")}`,
        ),
      );
    });

    it("should parseCommonArguments", () => {
      const actual = parseArgumentsV2(["analyze"]);

      expect(actual).toEqual({
        command: "analyze",
        commonArguments,
      });
    });
  });
});
