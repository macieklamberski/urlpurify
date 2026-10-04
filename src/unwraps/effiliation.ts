import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/servlet\/effi\.(?:redir|product)$/

const extractUrl = createParamExtractor({
  hosts: /\.effiliation\.com$/,
  params: ['url'],
})

// Effiliation French affiliate network (track.effiliation.com/servlet/effi.redir?url=<target>,
// also /servlet/effi.product), on every subdomain of effiliation.com.
export const unwrapEffiliation: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractUrl(url)
}
