import { describe, it, expect } from "vitest";
import { versionSourceSchema } from "@/release-helper/version-source-configuration";

describe("VersionSourceConfiguration", () => {
  describe("versionSourceSchema", () => {
    it("should parse versionFile and gitTagPrefix", () => {
      const versionSourceConfiguration = {
        versionFile: "build.sbt",
        gitTagPrefix: "auto-release",
        scope: "auto-release",
      };
      const actual = versionSourceSchema.parse(versionSourceConfiguration);

      expect(actual).toEqual(versionSourceConfiguration);
    });
  });
});
