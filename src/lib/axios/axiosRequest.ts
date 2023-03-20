import axios, { AxiosRequestConfig } from 'axios';
import { URL } from 'url';

import {
  AxiosServerError,
  AxiosError,
} from './errors';

export async function axiosRequest(options: AxiosRequestConfig): Promise<unknown> {
  try {
    if (process.env.PROXY_SERVER_ADDR && !options.proxy) {
      const proxyUrl = new URL(process.env.PROXY_SERVER_ADDR);
      options.proxy = {
        protocol: proxyUrl.protocol,
        host: proxyUrl.host,
        port: +proxyUrl.port,
      }
      if (proxyUrl.username) {
        options.proxy.auth = {
          username: proxyUrl.username,
          password: proxyUrl.password,
        }
      }
    }
    const response = await axios(options);
    return response.data;
  } catch (error) {
    if (error.isAxiosError) {
      if (error.response) {
        throw new AxiosServerError(error.response, error);
      }
      throw new AxiosError(`Axios: ${error.message}`, error);
    }
    throw error;
  }
}
