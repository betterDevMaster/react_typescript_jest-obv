import axios from 'axios'
import {getToken as getAuthToken} from 'auth/token'

const defaultHeaders = {
  'content-type': 'application/json',
}

export const client = {
  get: <T>(url: string, options?: {}) =>
    handleAxiosResult<T>(axios.get(url, config(options))),
  post: <T>(url: string, data: {}, options?: {}) =>
    handleAxiosResult<T>(axios.post(url, data, config(options))),
  put: <T>(url: string, data: {}, options?: {}) =>
    handleAxiosResult<T>(axios.put(url, data, config(options))),
  delete: <T>(url: string, options?: {}) =>
    handleAxiosResult<T>(axios.delete(url, config(options))),
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

async function handleAxiosResult<T>(promise: Promise<{data: T}>) {
  try {
    const res = await promise
    return res.data
  } catch (error) {
    // Response object
    if (error.response) {
      throw error.response.data
    }

    // Text error
    throw new Error(error)
  }
}
