import { beforeEach, describe, vi, it, expect } from "vitest";
import fs from "fs";
import { listFiles } from "@/release-helper/list-files";
import { Dirent } from "node:fs";

describe("ListFiles", () => {
  describe("listFiles", () => {
    const mockedReadDirSync = vi.spyOn(fs, "readdirSync");
    const directory = "~";

    const itemsInDirectory: Dirent[] = [];
    beforeEach(() => {
      vi.clearAllMocks();
      mockedReadDirSync.mockReturnValue(itemsInDirectory);
    });

    it("should call readdirSync with the provided directory", () => {
      listFiles(directory);

      expect(mockedReadDirSync).toHaveBeenCalledWith(directory);
    });

    it("should return same result as readDirSync", () => {
      const actual = listFiles(directory);

      expect(actual).toEqual(itemsInDirectory);
    });
  });
});
