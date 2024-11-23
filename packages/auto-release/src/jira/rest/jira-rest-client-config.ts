import { AxiosRequestConfig } from "axios";

export type JiraRestClientConfig = {
  host: string;
  axiosRequestConfig: AxiosRequestConfig<any>;
};
