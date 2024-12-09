import { describe, it, expect, vi, beforeEach } from "vitest";
import { readConfiguration } from "../read-configuration";
import path from "path";
import fs from "fs";
import * as ValidateConfig from "../validate-config";
import { defaultConfigurationFile } from "@/cli/arguments/common-arguments";

vi.mock("fs");

describe("readConfiguration", () => {
  const mockedExistsFileSync = vi.spyOn(fs, "existsSync");
  const mockedReadFileSync = vi.spyOn(fs, "readFileSync");
  const mockedExtractConfiguration = vi.spyOn(
    ValidateConfig,
    "extractConfiguration",
  );
  const absolutePath = path.resolve(process.cwd(), defaultConfigurationFile);
  const parsedConfiguration = { jiraBaseUrl: "https://myjira.jira.com" };
  const configuration = {};

  beforeEach(() => {
    vi.clearAllMocks();
    mockedExistsFileSync.mockReturnValue(true);
    mockedReadFileSync.mockReturnValue(JSON.stringify(parsedConfiguration));
    mockedExtractConfiguration.mockReturnValue(configuration);
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

  it("should throw unhandled exception when other exception thrown", () => {
    mockedExtractConfiguration.mockImplementation(() => {
      throw new Error("Some error");
    });

    expect(() => readConfiguration(defaultConfigurationFile)).toThrow(
      new Error("read configuration failed with unhandled exception"),
    );
  });

  it("should validate configuration", () => {
    readConfiguration(defaultConfigurationFile);

    expect(mockedExtractConfiguration).toHaveBeenCalledWith(
      parsedConfiguration,
    );
  });

  it("should return valid configuration file", () => {
    const actual = readConfiguration(defaultConfigurationFile);

    expect(actual).toEqual(configuration);
  });
});
