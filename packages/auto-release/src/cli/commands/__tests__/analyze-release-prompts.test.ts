import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  promptCreateRelease,
  promptSelectVersion,
  promptSetupRelease,
} from "@/cli/commands/analyze-release-prompts";
import * as Prompts from "@/cli/prompts";

describe("AnalyzeReleasePrompts", () => {
  describe("promptSetupRelease", () => {
    const mockedPromptOption = vi.spyOn(Prompts, "promptOption");

    beforeEach(() => {
      vi.clearAllMocks();
      mockedPromptOption.mockResolvedValue("do-nothing");
    });

    it("should prompt correctly", async () => {
      await promptSetupRelease();

      expect(mockedPromptOption).toHaveBeenCalledWith(
        "No git tag has been set up, you can still go for first release or set up first release",
        [
          {
            name: "Do nothing for now, I will do the release with the first commit from this repository",
            value: "do-nothing",
          },
          {
            name: "I want to set up first release",
            value: "setup-first-release",
          },
        ],
      );
    });

    it("should return result from promptOption", async () => {
      const actual = await promptSetupRelease();

      expect(actual).toEqual("do-nothing");
    });
  });

  describe("promptSelectVersion", () => {
    const mockedPromptOption = vi.spyOn(Prompts, "promptOption");
    const promptParams = {
      currentVersion: "1.0.0",
      calculatedVersion: "1.0.1",
    };
    const selectedVersion = "1.0.1";

    beforeEach(() => {
      vi.clearAllMocks();
      mockedPromptOption.mockResolvedValue(selectedVersion);
    });

    it("should prompt correctly", async () => {
      await promptSelectVersion(promptParams);

      expect(mockedPromptOption).toHaveBeenCalledWith(
        "Please choose the following version to create release",
        [
          {
            name: "1.0.0 (current version from project file)",
            value: "1.0.0",
          },
          {
            name: "1.0.1 (calculated version based on changes)",
            value: "1.0.1",
          },
        ],
      );
    });

    it("should return result from promptOption", async () => {
      const actual = await promptSelectVersion(promptParams);

      expect(actual).toEqual(selectedVersion);
    });
  });

  describe("promptCreateRelease", () => {
    const mockedPromptOption = vi.spyOn(Prompts, "promptOption");

    beforeEach(() => {
      vi.clearAllMocks();
      mockedPromptOption.mockResolvedValue("yes");
    });

    it("should prompt correctly", async () => {
      await promptCreateRelease({ version: "1.0.1" });

      expect(mockedPromptOption).toHaveBeenCalledWith(
        "Do you want to create release for version 1.0.1 now?",
        [
          {
            name: "Yes",
            value: "yes",
          },
          {
            name: "No",
            value: "no",
          },
        ],
      );
    });

    it("should return result from promptOption", async () => {
      const actual = await promptCreateRelease({ version: "1.0.1" });

      expect(actual).toEqual("yes");
    });
  });
});
