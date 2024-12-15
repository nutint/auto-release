import { describe, it } from "vitest";
import { createVersionHelper } from "@/release-helper/version-helper/create-version-helper";

describe("createVersionHelper", () => {
  it("should update version of my package json file", () => {
    const helper = createVersionHelper("./package.json");

    helper.setVersion("2.0.0");
  });

  it("should update version of my build.sbt file", () => {
    const helper = createVersionHelper("./build.sbt");

    helper.setVersion("2.0.1");
  });
});
