/**
 * Available languages an event site may have. Remember to add any new languages
 * to the ALL_LANGUAGES array to make it accessible throughout the app, as
 * well as update the type definition.
 */

export const ENGLISH = 'English'

/**
 * In TS@3.x we can automatically infer the type from a constant array.
 *
 * Reference: https://github.com/microsoft/TypeScript/issues/28046#issuecomment-607145719
 */

export type Language = string

/**
 * System default language. If a user hasn't specified a preferred language
 * we'll automatically use this language. This applies to all events.
 */
