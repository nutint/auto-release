import { describe, it, expect, vi, beforeEach } from "vitest";
import * as ReleaseHelper from "@/release-helper/release-helper";
import * as CreateVersionHelper from "@/release-helper/version-helper/create-version-helper";
import * as ChangeLog from "@/changelog/changelog";
import { release } from "@/cli/commands/release";
import {
  extractReleaseInformation,
  ReleaseInformation,
} from "@/release-helper/release-helper";
import { IVersionHelper } from "@/release-helper/version-helper/version-helper";

describe("Release", () => {
  describe("release", () => {
    const mockedExtractReleaseInformation = vi.spyOn(
      ReleaseHelper,
      "extractReleaseInformation",
    );
    const mockedAddChangeLog = vi.spyOn(ChangeLog, "addChangeLog");
    const mockedCreateVersionHelper = vi.spyOn(
      CreateVersionHelper,
      "createVersionHelper",
    );
    const mockedSetVersion = vi.fn();
    const versionSourceConfiguration = { versionFile: "package.json" };
    const configuration = {
      versionSource: versionSourceConfiguration,
    };
    const releaseInformation: ReleaseInformation = {
      foo: "bar",
      nextVersion: "1.0.2",
    } as unknown as ReleaseInformation;

    beforeEach(() => {
      vi.clearAllMocks();
      mockedExtractReleaseInformation.mockResolvedValue(releaseInformation);
      mockedAddChangeLog.mockResolvedValue();
      mockedCreateVersionHelper.mockReturnValue({
        setVersion: mockedSetVersion,
      } as unknown as IVersionHelper);
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

      expect(mockedAddChangeLog).toHaveBeenCalledWith(
        "CHANGELOG.md",
        releaseInformation,
      );
    });

    it("should update version file with new version", async () => {
      await release(configuration);

      expect(mockedCreateVersionHelper).toHaveBeenCalledWith(
        versionSourceConfiguration.versionFile,
      );
      expect(mockedSetVersion).toHaveBeenCalledWith(
        releaseInformation.nextVersion,
      );
    });
  });
});
