import axios from 'axios'
import {getToken as getAuthToken} from 'auth/token'
import {isFormData} from 'lib/http-client'
import {v4 as uuid} from 'uuid'

export type ResponseError = {
  message: string
}

export type ValidationError<T> = {
  message: string
  errors: Partial<T>
} | null

const defaultHeaders = {
  'content-type': 'application/json',
}

export type RequestOptions = {
  headers?: Record<string, string>
  tokenKey?: string
  noCache?: boolean
}

export type Client = typeof client

export const client = {
  get: <T>(url: string, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.get(url, createOptions(options))),
  post: <T>(url: string, data: {} | FormData = {}, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.post(url, data, createOptions(options))),
  put: <T>(url: string, data: {} | FormData, options?: RequestOptions) => {
    if (isFormData(data)) {
      const formDataOptions = {
        ...options,
        headers: {
          ...headers,
          'content-type': 'multipart/form-data',
        },
      }

      return handleAxiosResult<T>(
        axios.post(url, putData(data), createOptions(formDataOptions)),
      )
    }

    return handleAxiosResult<T>(axios.put(url, data, createOptions(options)))
  },
  patch: <T>(url: string, data: {} = {}, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.patch(url, data, createOptions(options))),
  delete: <T>(url: string, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.delete(url, createOptions(options))),
}

/**
 * Laravel/Symfony requires method to be specified
 *
 * @param data
 */
function putData(data: {} | FormData) {
  if (isFormData(data)) {
    data.append('_method', 'PUT')
    return data
  }

  return {
    _method: 'PUT',
    ...data,
  }
}

function createOptions(options: RequestOptions = {}) {
  return {
    headers: headers(options),
    ...options,
  }
}

function headers(options: RequestOptions) {
  const {headers: custom, tokenKey, noCache} = options

  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...custom,
  }

  if (tokenKey) {
    const token = getAuthToken(tokenKey)
    headers.Authorization = `Bearer ${token}`
  }

  /**
   * Cloudfront NoCache (custom) policy accepts a 'No-Cache'
   * header as key. If we pass in a different value,
   * CloudFront will fetch it again.
   */
  if (noCache) {
    headers['No-Cache'] = uuid()
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

export const jsonHeader = (token?: string | null) => {
  const header = {
    // Without correct Content-Type, rxjs will serialize objects into [object, object]
    'Content-Type': 'application/json',
  }

  if (!token) {
    return header
  }

  return {
    ...header,
    Authorization: `Bearer ${token}`,
  }
}

// Helper to create PUT request data for Laravel
export const put = (body: any) => ({
  ...body,
  _method: 'PUT',
})
