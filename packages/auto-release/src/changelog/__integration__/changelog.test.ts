import { describe, it } from "vitest";
import fs from "fs";

describe("ChangeLog", () => {
  const fileContent = "# Changelog - auto-release\n\n";
  const fileName = "CHANGELOG.md";
  it("should create file", () => {
    fs.writeFileSync(fileName, fileContent);
  });

  it("should check file content", () => {
    const fileContent = fs.readFileSync(fileName);
  });
});
