import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractTarget = createParamExtractor({
  hosts: /(^|\.)zemanta\.com$/,
  path: '/',
  params: ['u'],
})

// One feed carries the target as `http:/host`, with the double slash collapsed.
const collapsedSchemeRegex = /^(https?:)\/(?!\/)/i

// Zemanta related-article redirect (r.zemanta.com/?u=<target>&a=<id>&rid=<uuid>&e=<hash>).
export const unwrapZemanta: UrlUnwrapper = (url) => {
  return extractTarget(url)?.replace(collapsedSchemeRegex, '$1//')
}
