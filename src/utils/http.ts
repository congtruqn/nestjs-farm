import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });
export const sendPost = (url: string, data: any, headers = {}) => {
  return axios.request({
    url: url,
    method: 'POST',
    data: data,
    headers: { ...{ 'content-type': 'application/json' }, ...headers },
  });
};
export const getData = (url: string, headers = {}) => {
  return axios.request({
    url: url,
    method: 'GET',
    headers: { ...{ 'content-type': 'application/json' }, ...headers },
  });
};
