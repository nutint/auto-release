import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  IVersionHelper,
  VersionHelperError,
} from "@/release-helper/version-helper/version-helper";
import { createVersionHelper } from "@/release-helper/version-helper/create-version-helper";
import * as CreatePackageJsonHelper from "@/release-helper/version-helper/package-json-helper";
import * as CreateBuildSbtHelper from "@/release-helper/version-helper/build-sbt-helper";
import * as ListFile from "@/release-helper/list-files";

describe("CreateVersionHelper", () => {
  describe("createVersionHelper", () => {
    const mockedCreatePackageJsonHelper = vi.spyOn(
      CreatePackageJsonHelper,
      "createPackageJsonHelper",
    );

    const mockedCreateBuildSbtHelper = vi.spyOn(
      CreateBuildSbtHelper,
      "createBuildSbtHelper",
    );

    beforeEach(() => {
      vi.clearAllMocks();
      mockedCreatePackageJsonHelper.mockReturnValue({
        versionFileType: "package.json",
      } as unknown as IVersionHelper);
      mockedCreateBuildSbtHelper.mockReturnValue({
        versionFileType: "build.sbt",
      } as unknown as IVersionHelper);
    });

    describe("when versionFile specified", () => {
      it("should throw error when specified file is not support version file", () => {
        expect(() => createVersionHelper("/abc/def.exe")).toThrow(
          new VersionHelperError("unsupported version file"),
        );
      });

      it("should create helper with version file type package.json when accept package.json file", () => {
        const actual = createVersionHelper("/abc/package.json");

        expect(actual.versionFileType).toEqual("package.json");
      });

      it("should create helper with version file type build.sbt when accept build.sbt file", () => {
        const actual = createVersionHelper("/abc/build.sbt");

        expect(actual.versionFileType).toEqual("build.sbt");
      });
    });

    describe("when versionFile is not specified", () => {
      const mockedListFile = vi.spyOn(ListFile, "listFiles");

      const passedAutoDetectVersionFile = "/user/local/package.json";
      beforeEach(() => {
        vi.clearAllMocks();
        mockedListFile.mockReturnValue([passedAutoDetectVersionFile]);
      });
      it("should list files from current working directory", () => {
        createVersionHelper();

        expect(mockedListFile).toHaveBeenCalledWith(process.cwd());
      });

      it("should throw error when there is no support files in current working directory", () => {
        mockedListFile.mockReturnValue([]);

        expect(() => createVersionHelper()).toThrow(
          new VersionHelperError("unable to located support version file"),
        );
      });

      it("should createPackageJsonHelper based on auto detected", () => {
        createVersionHelper();

        expect(mockedCreatePackageJsonHelper).toHaveBeenCalledWith(
          passedAutoDetectVersionFile,
        );
      });
    });
  });
});
