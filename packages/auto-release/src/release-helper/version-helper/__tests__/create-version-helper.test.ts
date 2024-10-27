import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  IVersionHelper,
  VersionHelperError,
} from "@/release-helper/version-helper/version-helper";
import { createVersionHelper } from "@/release-helper/version-helper/create-version-helper";
import * as CreatePackageJsonHelper from "@/release-helper/version-helper/package-json-helper";
import * as CreateBuildSbtHelper from "@/release-helper/version-helper/build-sbt-helper";

describe("CreateVersionHelper", () => {
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
