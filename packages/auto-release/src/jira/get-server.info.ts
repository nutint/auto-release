import axios from "axios";

type JiraServerInfo = {
  deploymentType: "Server" | "Cloud";
  version: string;
  buildDate: string;
};

export const getUserAgent = () => "auto-release@0.0.3";

export const getServerInfo = async (host: string): Promise<JiraServerInfo> => {
  const result = await axios.get(`${host}/rest/api/2/serverInfo`, {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": getUserAgent(),
    },
  });

  const { deploymentType, version, buildDate } = result.data;
  return { deploymentType, version, buildDate };
};
