import axios from 'axios'
import {getToken as getAuthToken} from 'auth/token'
import {isFormData} from 'lib/http-client'
import {v4 as uuid} from 'uuid'

export interface PaginatedCollection<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

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

export interface Downloadable {
  data: string
  file_name: string
}

export type RequestOptions = {
  headers?: Record<string, string>
  tokenKey?: string
  noCache?: boolean
  isFormData?: boolean
}

export type Client = typeof client

export const client = {
  get: <T>(url: string, options?: RequestOptions) => {
    return handleAxiosResult<T>(
      axios.get(createUrl(url, options), createOptions(options)),
    )
  },
  post: <T>(url: string, data: {} | FormData = {}, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.post(url, data, createOptions(options))),
  put: <T>(url: string, data: {} | FormData = {}, options?: RequestOptions) => {
    if (isFormData(data)) {
      return handleAxiosResult<T>(
        axios.post(
          url,
          createData(data, 'PUT'),
          createOptions({
            ...options,
            isFormData: true,
          }),
        ),
      )
    }

    return handleAxiosResult<T>(axios.put(url, data, createOptions(options)))
  },
  patch: <T>(
    url: string,
    data: {} | FormData = {},
    options?: RequestOptions,
  ) => {
    if (isFormData(data)) {
      return handleAxiosResult<T>(
        axios.post(
          url,
          createData(data, 'PATCH'),
          createOptions({
            ...options,
            isFormData: true,
          }),
        ),
      )
    }

    return handleAxiosResult<T>(axios.patch(url, data, createOptions(options)))
  },
  delete: <T>(url: string, options?: RequestOptions) =>
    handleAxiosResult<T>(axios.delete(url, createOptions(options))),
}

/**
 * Laravel/Symfony requires method to be specified
 *
 * @param data
 */
function createData(data: {} | FormData, method: 'PUT' | 'PATCH') {
  if (isFormData(data)) {
    data.append('_method', method)
    return data
  }

  return {
    _method: method,
    ...data,
  }
}

function createUrl(url: string, options?: RequestOptions) {
  if (!options) {
    return url
  }

  if (options.noCache) {
    return appendNoCacheParam(url)
  }

  return url
}

function appendNoCacheParam(url: string) {
  const param = 'no-cache=true'
  const hasQueryString = /\?/.test(url)
  if (hasQueryString) {
    return `${url}&${param}`
  }

  return `${url}?${param}`
}

function createOptions(options: RequestOptions = {}) {
  return {
    ...options,
    headers: createHeaders(options),
  }
}

function createHeaders(options: RequestOptions) {
  const {headers: custom, tokenKey, noCache, isFormData} = options

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

  if (isFormData) {
    headers['content-type'] = 'multipart/form-data'
  }

  return headers
}

async function handleAxiosResult<T>(promise: Promise<{data: T}>) {
  try {
    const res = await promise
    return res.data
  } catch (error: any) {
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
