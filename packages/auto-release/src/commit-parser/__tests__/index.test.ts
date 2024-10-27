import { describe, it } from "vitest";
import { streamGitLog } from "@/commit-parser/commit-parser";

describe("commitParser", () => {
  describe("streamGitLog", () => {
    it(
      "should return result",
      async () => {
        const end = "HEAD";
        const gitLogStream = await streamGitLog({ end });
        console.log({ gitLogStream });
      },
      { timeout: 99999 },
    );
  });
});
