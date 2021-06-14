export const isProduction = process.env.NODE_ENV === 'production'
export const isTest = process.env.NODE_ENV === 'test'
export const isStaging = process.env.REACT_APP_IS_STAGING === 'true'
export const appRoot = process.env.REACT_APP_WEB_APP_ROOT
export const OBVIO_SUBDOMAIN = 'app'
