import { describe, it, expect } from "vitest";
import { processCli } from "../process-cli";

describe("processCli", () => {
  it("should should throw error when no configuration file", () => {
    expect(() => processCli([])).toThrow(
      new Error("Missing configuration file"),
    );
  });
});
