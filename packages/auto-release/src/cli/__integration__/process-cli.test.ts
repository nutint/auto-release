import { describe, it } from "vitest";
import { processCli } from "@/cli/process-cli";

describe("processCli(Integration)", () => {
  it(
    "should able to process cli",
    async () => {
      await processCli(["--analyze-release"]);
    },
    { timeout: 9999999 },
  );
});
