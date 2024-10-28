import { describe, it, expect } from "vitest";
import { versionRulesSchema } from "@/version/version-rules-configuration";

describe("VersionRuleSchema", () => {
  it("should fail when commit types is not valid", () => {
    expect(() =>
      versionRulesSchema.parse({
        minor: [],
        major: [],
        patch: ["something else"],
      }),
    ).toThrow();
  });

  it("should fail when one field is missing", () => {
    expect(() =>
      versionRulesSchema.parse({
        minor: [],
        major: [],
      }),
    ).toThrow();
  });

  it("should pass when all fields are just empty array", () => {
    expect(() =>
      versionRulesSchema.parse({
        minor: [],
        major: [],
        patch: [],
      }),
    ).not.toThrow();
  });
});
