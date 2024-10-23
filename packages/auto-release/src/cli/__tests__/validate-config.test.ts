import { describe, it, expect } from "vitest";
import { validateConfiguration } from "@/cli/validate-config";

describe("validate-config", () => {
  describe("validateConfiguration", () => {
    it("should pass when configuration is empty object", () => {
      const config = {};
      expect(() => validateConfiguration(config)).not.toThrow();
    });

    it("should fail when jiraBaseUrl is not valid URL", () => {
      const config = { jiraBaseUrl: "abc" };
      expect(() => validateConfiguration(config)).toThrow(
        new Error("Invalid configuration"),
      );
    });
  });
});
