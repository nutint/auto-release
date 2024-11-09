import { describe, it, expect, vi, beforeEach } from "vitest";

import { promptOption } from "@/cli/prompts";
import inquirer from "inquirer";

describe("Prompts", () => {
  describe("promptOption", () => {
    const mockedPrompt = vi.spyOn(inquirer, "prompt");

    const question = "Which version do you want to choose";
    const options = [
      { name: "1.0.0", value: "1.0.0" },
      { name: "1.0.1", value: "1.0.1" },
    ];

    beforeEach(() => {
      vi.clearAllMocks();
      mockedPrompt.mockResolvedValue({
        selectedOption: "1.0.1",
      });
    });

    it("should map to prompt correctly", async () => {
      await promptOption(question, options);

      expect(mockedPrompt).toHaveBeenCalledWith([
        {
          type: "list",
          name: "selectedOption",
          message: question,
          choices: options,
        },
      ]);
    });

    it("should return one of the option", async () => {
      const actual = await promptOption(question, options);

      expect(actual).toEqual("1.0.1");
    });
  });
});
