import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  IVersionHelper,
  VersionHelperError,
} from "@/release-helper/version-helper/version-helper";
import { createVersionHelper } from "@/release-helper/version-helper/create-version-helper";
import * as CreatePackageJsonHelper from "@/release-helper/version-helper/package-json-helper";

describe("CreateVersionHelper", () => {
  const mockedCreatePackageJsonHelper = vi.spyOn(
    CreatePackageJsonHelper,
    "createPackageJsonHelper",
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockedCreatePackageJsonHelper.mockReturnValue({
      versionFileType: "package.json",
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
});
