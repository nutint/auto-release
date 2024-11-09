type CreateReleaseParams = {
  version: string;
};

export const createRelease = async ({ version }: CreateReleaseParams) => {
  console.log(`creating release version: ${version}`);
};
