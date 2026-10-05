import { parseUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const proxySuffix = '.mcas.ms'

const extractTarget = createParamExtractor({
  hosts: 'mcas-proxyweb.mcas.ms',
  path: '/certificate-checker',
  params: ['originalUrl'],
})

// Microsoft Defender for Cloud Apps session proxy
// (mcas-proxyweb.mcas.ms/certificate-checker?originalUrl=<target>).
// Not included in defaultUnwrappers: the proxy applies the organization's session policy.
export const unwrapMcas: UrlUnwrapper = (url) => {
  const value = extractTarget(url)

  if (!value) {
    return
  }

  const target = parseUrl(value)

  if (!target) {
    return
  }

  // The proxy appends .mcas.ms to the host of every target, which only answers inside the session.
  if (target.hostname.endsWith(proxySuffix)) {
    target.hostname = target.hostname.slice(0, -proxySuffix.length)
  }

  return target.href
}
