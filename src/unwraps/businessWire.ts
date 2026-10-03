import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractTarget = createParamExtractor({
  hosts: 'cts.businesswire.com',
  path: '/ct/CT',
  params: ['url'],
})

const encodedSchemeRegex = /^https?%3A/i

// Business Wire release click tracker (cts.businesswire.com/ct/CT?url=<target>).
export const unwrapBusinessWire: UrlUnwrapper = (url) => {
  let target = extractTarget(url)

  if (!target) {
    return
  }

  // Some releases encode the target twice.
  if (encodedSchemeRegex.test(target)) {
    try {
      target = decodeURIComponent(target)
    } catch {
      return
    }
  }

  if (isHttpUrl(target)) {
    return target
  }
}
