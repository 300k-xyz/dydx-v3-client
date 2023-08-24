import axios, { AxiosRequestConfig } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import {
  AxiosServerError,
  AxiosError,
} from './errors';

export async function axiosRequest(options: AxiosRequestConfig): Promise<unknown> {
  try {
    if (process.env.PROXY_SERVER_ADDR) {
      const httpsAgent = new HttpsProxyAgent(process.env.PROXY_SERVER_ADDR);
      options.httpsAgent = httpsAgent
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
