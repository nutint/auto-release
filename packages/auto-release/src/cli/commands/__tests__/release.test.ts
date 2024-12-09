import { describe, it, expect, vi, beforeEach } from "vitest";
import * as ReleaseHelper from "@/release-helper/release-helper";
import * as ChangeLog from "@/changelog/changelog";
import { release } from "@/cli/commands/release";
import {
  extractReleaseInformation,
  ReleaseInformation,
} from "@/release-helper/release-helper";

describe("Release", () => {
  describe("release", () => {
    const mockedExtractReleaseInformation = vi.spyOn(
      ReleaseHelper,
      "extractReleaseInformation",
    );
    const mockedAddChangeLog = vi.spyOn(ChangeLog, "addChangeLog");
    const versionSourceConfiguration = { versionFile: "package.json" };
    const releaseInformation: ReleaseInformation = {
      foo: "bar",
    } as unknown as ReleaseInformation;

    beforeEach(() => {
      vi.clearAllMocks();
      mockedExtractReleaseInformation.mockResolvedValue(releaseInformation);
      mockedAddChangeLog.mockResolvedValue();
    });

    it("should extract release information with empty versionSourceConfiguration when pass no parameter", async () => {
      await release();

      expect(extractReleaseInformation({}));
    });

    it("should extract release information with versionSourceConfiguration", async () => {
      await release(versionSourceConfiguration);

      expect(mockedExtractReleaseInformation).toHaveBeenCalledWith(
        versionSourceConfiguration,
      );
    });

    it("should add changelog with release release information", async () => {
      await release(versionSourceConfiguration);

      expect(mockedAddChangeLog).toHaveBeenCalledWith(releaseInformation);
    });
  });
});
