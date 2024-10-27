import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBuildSbtHelper } from "../build-sbt-helper";
import fs from "fs";
import { VersionHelperError } from "@/release-helper/version-helper/version-helper";

describe("BuildSbtHelper", () => {
  const mockedReadFileSync = vi.spyOn(fs, "readFileSync");

  const versionFile = "/abc/build.sbt";

  beforeEach(() => {
    vi.clearAllMocks();
    mockedReadFileSync.mockReturnValue(
      'name := "my-project"\nversion := "1.0.0"',
    );
  });

  it("should readFileSync", () => {
    createBuildSbtHelper(versionFile);

    expect(mockedReadFileSync).toHaveBeenCalledWith(versionFile, "utf-8");
  });

  it("should throw error when file content is not contains version", () => {
    mockedReadFileSync.mockReturnValue("");

    expect(() => createBuildSbtHelper(versionFile)).toThrow(
      new VersionHelperError("invalid build.sbt file"),
    );
  });

  it("should have version file type as build.sbt", () => {
    const actual = createBuildSbtHelper(versionFile);

    expect(actual.versionFileType).toEqual("build.sbt");
  });

  it("should return correct packageVersion from build.sbt file", () => {
    const actual = createBuildSbtHelper(versionFile);

    expect(actual.getVersion().packageVersion).toEqual("1.0.0");
  });
});
