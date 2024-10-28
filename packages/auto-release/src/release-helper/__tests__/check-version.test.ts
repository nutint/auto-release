import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkVersion } from "@/release-helper/check-version";
import * as ListFile from "@/release-helper/list-files";
import * as CreateVersionHelper from "@/release-helper/version-helper/create-version-helper";
import * as GetVersionInfoFromGitHistory from "@/release-helper/version-helper/get-version-info-from-git-history";

describe("CheckVersion", () => {
  describe("checkVersion", () => {
    const mockedCreateVersionHelper = vi.spyOn(
      CreateVersionHelper,
      "createVersionHelper",
    );
    const mockedGetVersionInfoFromGitHistory = vi.spyOn(
      GetVersionInfoFromGitHistory,
      "getVersionInfoFromGitHistory",
    );

    const packageVersion = "1.0.1";
    const latestGitTag = "1.0.0";
    const version = {
      packageVersion: "1.0.1",
      latestGitTag,
    };
    const versionInfoFromGitHistory = {
      latestTags: ["1.0-1-beta"],
      latestStableTags: [latestGitTag],
    };

    const versionFile =
      "/MyProjects/auto-release/packages/auto-release/package.json";
    beforeEach(() => {
      vi.clearAllMocks();
      mockedCreateVersionHelper.mockReturnValue({
        getVersion: () => packageVersion,
        versionFileType: "package.json",
      });
      mockedGetVersionInfoFromGitHistory.mockResolvedValue(
        versionInfoFromGitHistory,
      );
    });

    it("should get version info from git history", async () => {
      await checkVersion({ versionFile });

      expect(mockedGetVersionInfoFromGitHistory).toHaveBeenCalled();
    });

    describe("when specify version file as package.json", () => {
      it("should create version helper with specified version file", async () => {
        await checkVersion({ versionFile });

        expect(mockedCreateVersionHelper).toHaveBeenCalledWith(versionFile);
      });

      it("should return version info by the result of version helper and latest stable tag", async () => {
        const actual = await checkVersion({ versionFile });

        expect(actual).toEqual(version);
      });

      it("should return version info without latest git tags when no latest stable tag", async () => {
        mockedGetVersionInfoFromGitHistory.mockResolvedValue({
          ...versionInfoFromGitHistory,
          latestStableTags: [],
        });

        const actual = await checkVersion({ versionFile });

        expect(actual).toEqual({
          ...version,
          latestGitTag: undefined,
        });
      });
    });

    describe("when not specify version file", () => {
      const mockedListFile = vi.spyOn(ListFile, "listFiles");

      const autoDetectedPackageVersion = "1.0.2";
      const autoDetectedVersion = {
        packageVersion: autoDetectedPackageVersion,
        latestGitTag: latestGitTag,
      };
      const passedAutoDetectVersionFile = "/user/local/package.json";

      beforeEach(() => {
        vi.clearAllMocks();
        mockedListFile.mockResolvedValue([passedAutoDetectVersionFile]);
      });
      it("should list files with current working directory", async () => {
        await checkVersion();

        expect(mockedListFile).toHaveBeenCalledWith(process.cwd());
      });

      it("should throw error when there is no support files in current working directory", async () => {
        mockedListFile.mockResolvedValue([]);

        expect(() => checkVersion()).rejects.toEqual(
          new Error(
            "Check version failed: Unable to located support version files",
          ),
        );
      });

      it("should create version helper when found support version file", async () => {
        mockedCreateVersionHelper.mockReturnValue({
          getVersion: () => autoDetectedPackageVersion,
          versionFileType: "package.json",
        });

        await checkVersion();

        expect(mockedCreateVersionHelper).toHaveBeenCalledWith(
          passedAutoDetectVersionFile,
        );
      });

      it("should return version from auto detected packageJsonVersion", async () => {
        mockedCreateVersionHelper.mockReturnValue({
          getVersion: () => autoDetectedPackageVersion,
          versionFileType: "package.json",
        });

        const actual = await checkVersion();

        expect(actual).toEqual(autoDetectedVersion);
      });
    });
  });
});
