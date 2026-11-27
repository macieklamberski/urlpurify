import { parseUrl } from 'trousse'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

// The suffix each cloud's proxy appends to every target host.
const proxySuffixes = ['.mcas.ms', '.mcas-gov.us', '.mcas-gov.ms']

const hosts = ['mcas-proxyweb.mcas.ms', 'mcas-proxyweb.mcas-gov.us', 'mcas-proxyweb.mcas-gov.ms']

const extractTarget = createQueryUnwrapper({
  hosts,
  path: '/certificate-checker',
  params: ['originalUrl'],
})

// Microsoft Defender for Cloud Apps session proxy (mcas-proxyweb.mcas.ms/certificate-checker
// ?originalUrl=<target>, also on mcas-proxyweb.mcas-gov.us and mcas-proxyweb.mcas-gov.ms).
// Not included in defaultUnwrappers: the proxy applies the organization's session policy.
export const unwrapMcas = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const value = extractTarget(url)

    if (!value) {
      return
    }

    const target = parseUrl(value)

    if (!target) {
      return
    }

    // The proxy appends its suffix to every target host, which only answers inside the session.
    const suffix = proxySuffixes.find((proxySuffix) => target.hostname.endsWith(proxySuffix))

    if (suffix) {
      target.hostname = target.hostname.slice(0, -suffix.length)
    }

    return target.href
  },
})
