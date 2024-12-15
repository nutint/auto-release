import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPackageJsonHelper } from "../package-json-helper";
import { VersionHelperError } from "@/release-helper/version-helper/version-helper";
import fs from "fs";

describe("PackageJsonHelper", () => {
  describe("createPackageJsonHelper", () => {
    const mockedReadFileSync = vi.spyOn(fs, "readFileSync");

    const versionFile = "/abc/package.json";
    const packageJsonContent = { name: "FooProject", version: "1.0.0" };

    beforeEach(() => {
      vi.clearAllMocks();
      mockedReadFileSync.mockReturnValue(
        JSON.stringify(packageJsonContent, null, 2),
      );
    });

    it("should readFileSync", () => {
      createPackageJsonHelper(versionFile);

      expect(mockedReadFileSync).toHaveBeenCalledWith(versionFile, "utf-8");
    });

    it("should throw error when the file content is not json format", () => {
      mockedReadFileSync.mockReturnValue("some non json content");

      expect(() => createPackageJsonHelper(versionFile)).toThrow(
        new VersionHelperError("invalid package.json file"),
      );
    });

    it("should throw error when parsed json file does not have version", () => {
      mockedReadFileSync.mockReturnValue(
        JSON.stringify({ name: "something else" }),
      );

      expect(() => createPackageJsonHelper(versionFile)).toThrow(
        new VersionHelperError("invalid package.json file"),
      );
    });

    describe("versionFileType", () => {
      it("should have version file type as package.json", () => {
        const actual = createPackageJsonHelper(versionFile);

        expect(actual.versionFileType).toEqual("package.json");
      });
    });

    describe("getVersion", () => {
      it("should return correct packageVersion from package.json file", () => {
        const actual = createPackageJsonHelper(versionFile);

        expect(actual.getVersion()).toEqual("1.0.0");
      });
    });

    describe("setVersion", () => {
      const mockedWriteFileSync = vi.spyOn(fs, "writeFileSync");

      beforeEach(() => {
        vi.clearAllMocks();
        mockedWriteFileSync.mockReturnValue();
      });

      it("should writeFileSync with updated json with new version", () => {
        const actual = createPackageJsonHelper(versionFile);

        const version = "1.0.1";
        actual.setVersion(version);

        expect(mockedWriteFileSync).toHaveBeenCalledWith(
          versionFile,
          JSON.stringify(
            {
              ...packageJsonContent,
              version: version,
            },
            null,
            2,
          ),
          "utf-8",
        );
      });
    });
  });
});
