import axios from 'axios'
import {getToken as getAuthToken} from 'auth/client'

const defaultHeaders = {
  'content-type': 'application/json',
}

export const client = {
  get: (url: string, options?: {}) =>
    handleAxiosResult(axios.get(url, config(options))),
  post: (url: string, data: {}, options?: {}) =>
    handleAxiosResult(axios.post(url, data, config(options))),
  put: (url: string, data: {}, options?: {}) =>
    handleAxiosResult(axios.put(url, data, config(options))),
  delete: (url: string, options?: {}) =>
    handleAxiosResult(axios.delete(url, config(options))),
}

function config({
  headers: customHeaders,
  ...otherOptions
}: {
  headers?: {}
} = {}) {
  return {headers: headers(customHeaders), ...otherOptions}
}

function headers(custom = {}) {
  const headers: {[property: string]: string} = {
    ...defaultHeaders,
    ...custom,
  }

  const token = getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function handleAxiosResult(promise: Promise<any>) {
  try {
    const res = await promise
    return res.data
  } catch (error) {
    const message = error.response ? error.response.data : error
    throw new Error(message)
  }
}
