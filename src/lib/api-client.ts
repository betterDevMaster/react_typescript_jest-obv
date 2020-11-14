import axios from 'axios'
import {getToken as getAuthToken} from 'auth/token'

export type ValidationError<T> = {
  message: string
  errors: Partial<T>
}

const defaultHeaders = {
  'content-type': 'application/json',
}

type RequestOptions = {
  headers?: Record<string, string>
}

export const client = {
  get: <T>(url: string, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.get(url, config(options))),
  post: <T>(url: string, data: {}, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.post(url, data, config(options))),
  put: <T>(url: string, data: {}, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.put(url, data, config(options))),
  delete: <T>(url: string, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.delete(url, config(options))),
}

function config({
  headers: customHeaders,
  ...otherOptions
}: RequestOptions = {}) {
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
