import { VersionSourceConfiguration } from "@/release-helper/version-source-configuration";
import { extractReleaseInformation } from "@/release-helper/release-helper";
import { addChangeLog } from "@/changelog/changelog";

export const release = async (
  versionSourceConfiguration: VersionSourceConfiguration = {},
) => {
  const releaseInformation = await extractReleaseInformation(
    versionSourceConfiguration,
  );
  await addChangeLog(releaseInformation);
};
