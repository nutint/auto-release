import { describe, it, expect, beforeEach, vi } from "vitest";
import * as ReleaseHelper from "@/release-helper/release-helper";
import { OutputFormat } from "@/cli/parse-arguments";
import { analyzeRelease } from "@/cli/commands/analyze-release";
import { ReleaseInformation } from "@/release-helper/release-helper";
import * as AnalyzeReleasePrompts from "@/cli/commands/analyze-release-prompts";
import * as CreateRelease from "@/cli/commands/create-release";

describe("AnalyzeRelease", () => {
  describe("analyzeRelease", () => {
    const mockedExtractReleaseInformation = vi.spyOn(
      ReleaseHelper,
      "extractReleaseInformation",
    );
    const mockedPrintReleaseInformation = vi.spyOn(
      ReleaseHelper,
      "printReleaseInformation",
    );
    const mockedPromptSetupRelease = vi.spyOn(
      AnalyzeReleasePrompts,
      "promptSetupRelease",
    );

    const mockedPromptSelectVersion = vi.spyOn(
      AnalyzeReleasePrompts,
      "promptSelectVersion",
    );

    const mockedPromptCreateRelease = vi.spyOn(
      AnalyzeReleasePrompts,
      "promptCreateRelease",
    );

    const mockedCreateRelease = vi.spyOn(CreateRelease, "createRelease");

    const versionSource = {
      versionFile: "/abc/build.sbt",
    };

    const analyzeOptions = {
      interactive: false,
      outputFormat: "json" as OutputFormat,
    };
    const releaseInformation = {
      foo: "bar",
      currentVersion: "1.0.0",
      latestTagVersion: "1.0.0",
      nextVersion: "1.0.1",
    } as unknown as ReleaseInformation;

    beforeEach(() => {
      vi.clearAllMocks();
      mockedExtractReleaseInformation.mockResolvedValue(releaseInformation);
      mockedPrintReleaseInformation.mockReturnValue();
      mockedPromptSetupRelease.mockResolvedValue("do-nothing");
      mockedPromptSelectVersion.mockResolvedValue("1.0.1");
      mockedPromptCreateRelease.mockResolvedValue("no");
      mockedCreateRelease.mockResolvedValue();
    });

    it("should extract release information with empty object as configuration when version source configuration is undefined", async () => {
      await analyzeRelease(undefined, analyzeOptions);

      expect(mockedExtractReleaseInformation).toHaveBeenCalledWith({});
    });

    it("should extract release information based on version source", async () => {
      await analyzeRelease(versionSource, analyzeOptions);

      expect(mockedExtractReleaseInformation).toHaveBeenCalledWith(
        versionSource,
      );
    });

    it("should print release information based on release information and output format", async () => {
      await analyzeRelease(versionSource, analyzeOptions);

      expect(mockedPrintReleaseInformation).toHaveBeenCalledWith(
        releaseInformation,
        analyzeOptions.outputFormat,
      );
    });

    it("should prompt to set up release when latest git tag is undefined and interactive is true", async () => {
      mockedExtractReleaseInformation.mockResolvedValue({
        ...releaseInformation,
        latestTagVersion: undefined,
      });

      await analyzeRelease(versionSource, {
        ...analyzeOptions,
        interactive: true,
      });

      expect(mockedPromptSetupRelease).toHaveBeenCalled();
    });

    it("should prompt select version when set up release prompt answer to setup first release", async () => {
      mockedExtractReleaseInformation.mockResolvedValue({
        ...releaseInformation,
        latestTagVersion: undefined,
      });
      mockedPromptSetupRelease.mockResolvedValue("setup-first-release");

      await analyzeRelease(versionSource, {
        ...analyzeOptions,
        interactive: true,
      });

      expect(mockedPromptSelectVersion).toHaveBeenCalledWith({
        currentVersion: releaseInformation.currentVersion,
        calculatedVersion: releaseInformation.nextVersion,
      });
    });

    it("should summarize and prompt what will happen when on selected version", async () => {
      mockedExtractReleaseInformation.mockResolvedValue({
        ...releaseInformation,
        latestTagVersion: undefined,
      });
      mockedPromptSetupRelease.mockResolvedValue("setup-first-release");

      await analyzeRelease(versionSource, {
        ...analyzeOptions,
        interactive: true,
      });

      expect(mockedPromptCreateRelease).toHaveBeenCalledWith({
        version: "1.0.1",
      });
    });

    it("should not create release when user reject create new release", async () => {
      mockedExtractReleaseInformation.mockResolvedValue({
        ...releaseInformation,
        latestTagVersion: undefined,
      });
      mockedPromptSetupRelease.mockResolvedValue("setup-first-release");

      await analyzeRelease(versionSource, {
        ...analyzeOptions,
        interactive: true,
      });

      expect(mockedCreateRelease).not.toHaveBeenCalled();
    });

    it("should create release with selected version when user accept create new release", async () => {
      mockedExtractReleaseInformation.mockResolvedValue({
        ...releaseInformation,
        latestTagVersion: undefined,
      });
      mockedPromptSetupRelease.mockResolvedValue("setup-first-release");
      mockedPromptCreateRelease.mockResolvedValue("yes");

      await analyzeRelease(versionSource, {
        ...analyzeOptions,
        interactive: true,
      });

      expect(mockedCreateRelease).toHaveBeenCalledWith({
        version: "1.0.1",
      });
    });
  });
});
