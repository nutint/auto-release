import { describe, it, vi } from "vitest";
import * as GitHelper from "@/git/git-helper";
import { createLogConfig } from "@/release-helper/release-helper";
import { lastValueFrom, toArray } from "rxjs";

describe("GetLatestTag", () => {
  it("should get by commits", async () => {
    const $result = GitHelper.gitHelper()
      .getLogStream(createLogConfig({ scope: "auto-release" }))
      .pipe(toArray());

    const result = await lastValueFrom($result);

    console.log({ result });
  });
});
