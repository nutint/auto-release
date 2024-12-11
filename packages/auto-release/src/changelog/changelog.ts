import { ReleaseInformation } from "@/release-helper/release-helper";
import fs from "fs-extra";
import dayjs from "dayjs";
import { logger } from "@/logger/logger";

export const addChangeLog = async (releaseInformation: ReleaseInformation) => {
  const {
    changes: { minor, major, patch },
    nextVersion,
  } = releaseInformation;

  if (minor.length + major.length + patch.length === 0) {
    throw new ChangeLogException(`no change for version ${nextVersion}`);
  }
  const changelogFile = "CHANGELOG.md";
  try {
    await fs.ensureFile(changelogFile);
  } catch (e) {
    logger.info(`directory created for ${changelogFile}`);
  }
  const fileContent = fs.readFileSync(changelogFile, "utf-8");
  if (fileContent === "") {
    fs.writeFileSync(changelogFile, initChangelog(releaseInformation), "utf-8");
    return;
  }
  const newFileContent = appendChangeLog(
    fileContent,
    calculateChangeString(releaseInformation),
  );
  fs.writeFileSync(changelogFile, newFileContent, "utf-8");
};
const heading = "# Changelog\n\n";

export const appendChangeLog = (content: string, newContent: string) => {
  return content.replace(heading, `${heading}${newContent}\n\n`);
};

export const calculateChangeString = (
  releaseInformation: ReleaseInformation,
): string => {
  const {
    changes: { minor, patch },
  } = releaseInformation;
  return `## [Version 0.0.1] - ${dayjs().format("YYYY-MM-DD")}

### 🚀 Features
${minor.map((change) => `- ${change}`)}

### 🛠️ Fixes
${patch.map((change) => `- ${change}`)}
`;
};

export const initChangelog = (releaseInformation: ReleaseInformation) => {
  const newChanges = calculateChangeString(releaseInformation);
  return `${heading}${newChanges}`;
};

export class ChangeLogException extends Error {
  constructor(message: string) {
    super(`ChangeLogException: ${message}`);
  }
}
