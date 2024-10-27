import { describe, it, expect, vi, beforeEach } from "vitest";
import { createPackageJsonHelper } from "../package-json-helper";
import { VersionHelperError } from "@/release-helper/version-helper/version-helper";
import fs from "fs";

describe("PackageJsonHelper", () => {
  const mockedReadFileSync = vi.spyOn(fs, "readFileSync");

  const versionFile = "/abc/package.json";

  beforeEach(() => {
    vi.clearAllMocks();
    mockedReadFileSync.mockReturnValue(
      JSON.stringify({ name: "FooProject", version: "1.0.0" }),
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

  it("should have version file type as package.json", () => {
    const actual = createPackageJsonHelper(versionFile);

    expect(actual.versionFileType).toEqual("package.json");
  });

  it("should return correct packageVersion from package.json file", () => {
    const actual = createPackageJsonHelper(versionFile);

    expect(actual.getVersion().packageVersion).toEqual("1.0.0");
  });
});
