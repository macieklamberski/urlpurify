import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractLiteUrl = createParamExtractor({
  hosts: 'googleweblight.com',
  path: '/',
  params: ['lite_url'],
})

const extractPageUrl = createParamExtractor({
  hosts: 'googleweblight.com',
  path: '/i',
  params: ['u'],
})

// Google Web Light page proxy for slow connections (googleweblight.com/?lite_url=<target>, also
// /i?u=<target>). Opt-in, as the other proxies.
export const unwrapGoogleWebLight: UrlUnwrapper = (url) => {
  return extractLiteUrl(url) ?? extractPageUrl(url)
}
