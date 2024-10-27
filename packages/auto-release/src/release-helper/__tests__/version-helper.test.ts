import { describe, it, expect } from "vitest";
import {
  createVersionHelper,
  VersionHelperError,
} from "@/release-helper/version-helper";

describe("VersionHelper", () => {
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
