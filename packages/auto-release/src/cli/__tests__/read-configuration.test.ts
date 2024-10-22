import { describe, it, expect, vi, beforeEach } from "vitest";
import { readConfiguration } from "../read-configuration";
import path from "path";
import { defaultConfigurationFile } from "@/cli/parse-arguments";
import fs from "fs";

vi.mock("fs");

describe("readConfiguration", () => {
  const mockedExistsFileSync = vi.spyOn(fs, "existsSync");
  const mockedReadFileSync = vi.spyOn(fs, "readFileSync");
  const absolutePath = path.resolve(process.cwd(), defaultConfigurationFile);

  beforeEach(() => {
    vi.clearAllMocks();
    mockedExistsFileSync.mockReturnValue(true);
    mockedReadFileSync.mockReturnValue(JSON.stringify({ foo: "bar" }));
  });

  it("should check file exists by absolute path", async () => {
    readConfiguration(defaultConfigurationFile);

    expect(mockedExistsFileSync).toHaveBeenCalledWith(absolutePath);
  });

  it("should throw error when file does not exists", () => {
    mockedExistsFileSync.mockReturnValue(false);

    expect(() => readConfiguration(defaultConfigurationFile)).toThrow(
      new Error(`read configuration failed: ${absolutePath} does not exists`),
    );
  });

  it("should readFileSync", () => {
    readConfiguration(defaultConfigurationFile);

    expect(mockedReadFileSync).toHaveBeenCalledWith(absolutePath, "utf-8");
  });

  it("should throw error when file content is not json format", () => {
    mockedReadFileSync.mockReturnValue("nonJsonFormat");

    expect(() => readConfiguration(defaultConfigurationFile)).toThrow(
      new Error(
        `read configuration failed: ${absolutePath} incorrect format: expect JSON`,
      ),
    );
  });

  it("should return valid configuration file", () => {
    const actual = readConfiguration(defaultConfigurationFile);

    expect(actual).toEqual({ foo: "bar" });
  });
});
