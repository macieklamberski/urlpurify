import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const pathRegex = /^\/(?:[A-Za-z0-9]+|a\/1\/[\w=-]+)$/

const extractTarget = createParamExtractor({
  hosts: 'clicktime.symantec.com',
  params: ['u'],
})

// Symantec Email Security.cloud click-time URL protection
// (clicktime.symantec.com/<token>?u=<target>, also /a/1/<token>=?d=<data>&u=<target>).
// Opt-in, like the other email security gateways.
export const unwrapSymantecClicktime: UrlUnwrapper = (url) => {
  if (!pathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
