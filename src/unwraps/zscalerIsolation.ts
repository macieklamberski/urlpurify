import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const sessionPathRegex = /^\/profile\/[0-9a-f-]{36}\/zia-session\/$/

const extractTarget = createParamExtractor({
  hosts: /^[0-9a-f]{8}\.isolation\.zscaler\.com$/,
  params: ['original_url'],
})

// Zscaler cloud browser isolation
// (<hex>.isolation.zscaler.com/profile/<uuid>/zia-session/?original_url=<target>&key=&hmac=).
// Opt-in: a security proxy whose session needs the tenant's sign-in, so unwrapping skips it.
export const unwrapZscalerIsolation: UrlUnwrapper = (url) => {
  if (!sessionPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
