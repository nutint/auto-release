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
    const configuration = {
      versionSource: versionSourceConfiguration,
    };
    const releaseInformation: ReleaseInformation = {
      foo: "bar",
    } as unknown as ReleaseInformation;

    beforeEach(() => {
      vi.clearAllMocks();
      mockedExtractReleaseInformation.mockResolvedValue(releaseInformation);
      mockedAddChangeLog.mockResolvedValue();
    });

    it("should extract release information when configuration has no versionSource configuration", async () => {
      await release({
        ...configuration,
        versionSource: undefined,
      });

      expect(extractReleaseInformation({}));
    });

    it("should extract release information with versionSourceConfiguration", async () => {
      await release(configuration);

      expect(mockedExtractReleaseInformation).toHaveBeenCalledWith(
        versionSourceConfiguration,
      );
    });

    it("should add changelog with release release information", async () => {
      await release(configuration);

      expect(mockedAddChangeLog).toHaveBeenCalledWith(releaseInformation);
    });
  });
});
