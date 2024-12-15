import { extractReleaseInformation } from "@/release-helper/release-helper";
import { addChangeLog } from "@/changelog/changelog";
import { Configuration } from "@/cli/configuration";
import { createVersionHelper } from "@/release-helper/version-helper/create-version-helper";

export const release = async (configuration: Configuration) => {
  const { versionSource } = configuration;
  const releaseInformation = await extractReleaseInformation(versionSource);
  await addChangeLog("CHANGELOG.md", releaseInformation);
  createVersionHelper(versionSource?.versionFile).setVersion(
    releaseInformation.nextVersion,
  );
};
