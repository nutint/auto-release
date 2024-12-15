import { ReleaseInformation } from "@/release-helper/release-helper";
import fs from "fs-extra";
import dayjs from "dayjs";
import { logger } from "@/logger/logger";
import { MappedCommit } from "@/git/git-log";
import { CommitInfo } from "@/release-helper/commit-info/extract-commit-info";

export const addChangeLog = async (
  changelogFile: string,
  releaseInformation: ReleaseInformation,
) => {
  const {
    changes: { minor, major, patch },
    nextVersion,
  } = releaseInformation;

  if (minor.length + major.length + patch.length === 0) {
    throw new ChangeLogException(`no change for version ${nextVersion}`);
  }
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

const renderChanges = (heading: string, changes: MappedCommit<CommitInfo>[]) =>
  `${heading}\n${changes.map((change) => `- ${change.mapped.subject}`).join("\n")}`;

export const calculateChangeString = (
  releaseInformation: ReleaseInformation,
): string => {
  const {
    nextVersion,
    changes: { major, minor, patch },
  } = releaseInformation;

  const changeString = [
    { heading: "### 🎉 Major Changes", changes: major },
    { heading: "### 🚀 Features", changes: minor },
    { heading: "### 🛠️ Fixes", changes: patch },
  ]
    .filter(({ changes }) => changes.length > 0)
    .map(({ heading, changes }) => renderChanges(heading, changes))
    .join("\n\n");

  return `## [Version ${nextVersion}] - ${dayjs().format("YYYY-MM-DD")}

${changeString}
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
