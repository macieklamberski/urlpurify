import { createParamExtractor } from '../utils.js'

const googleTranslateHostRegex = /^translate\.google\.(?:com|[a-z]{2,3}(?:\.[a-z]{2,3})?)$/

// Google Translate (translate.google.<TLD>/translate?u=<target>).
// Not included in defaultUnwrappers: translate.google.com renders the
// target translated, so unwrapping discards the translation the user wanted.
// Opt in by passing a custom unwrappers array.
export const unwrapGoogleTranslate = createParamExtractor({
  hosts: googleTranslateHostRegex,
  path: '/translate',
  params: ['u'],
})
