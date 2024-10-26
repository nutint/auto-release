import { describe, it, expect } from "vitest";
import { extractConfiguration } from "@/cli/validate-config";

describe("validate-config", () => {
  describe("validateConfiguration", () => {
    it("should pass when configuration is empty object", () => {
      const config = {};
      expect(() => extractConfiguration(config)).not.toThrow();
    });

    it("should fail when jiraConfiguration is incorrect format", () => {
      const config = { jiraConfiguration: "abc" };
      expect(() => extractConfiguration(config)).toThrow(
        new Error("Invalid configuration"),
      );
    });

    it("should fail when version rule is incorrect format", () => {
      const config = { versionRules: { incorrectFormat: true } };

      expect(() => extractConfiguration(config)).toThrow(
        new Error("Invalid configuration"),
      );
    });
  });
});
