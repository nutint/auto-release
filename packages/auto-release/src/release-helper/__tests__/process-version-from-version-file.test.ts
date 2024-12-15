import { describe, it, expect, vi, beforeEach } from "vitest";
import { processVersionFromVersionFile } from "@/release-helper/process-version-from-version-file";
import * as CreateVersionHelper from "@/release-helper/version-helper/create-version-helper";

describe("ProcessVersionFromVersionFile", () => {
  describe("processVersionFromVersionFile", () => {
    const mockedCreateVersionHelper = vi.spyOn(
      CreateVersionHelper,
      "createVersionHelper",
    );

    const packageVersion = "1.0.1";

    const versionFile =
      "/MyProjects/auto-release/packages/auto-release/package.json";
    beforeEach(() => {
      vi.clearAllMocks();
      mockedCreateVersionHelper.mockReturnValue({
        getVersion: () => packageVersion,
        setVersion: (newVersion: string) => {},
        versionFileType: "package.json",
      });
    });

    it("should create version helper with undefined version file when no parameter provided", async () => {
      await processVersionFromVersionFile();

      expect(mockedCreateVersionHelper).toHaveBeenCalledWith(undefined);
    });

    it("should create version helper with specified version file", async () => {
      await processVersionFromVersionFile({ versionFile });

      expect(mockedCreateVersionHelper).toHaveBeenCalledWith(versionFile);
    });

    it("should return version info by the result of version helper and latest stable tag", async () => {
      const actual = await processVersionFromVersionFile({ versionFile });

      expect(actual).toEqual(packageVersion);
    });
  });
});
