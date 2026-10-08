import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const protocolRelativeRegex = /^\/\/[^/\\]/

const extractSrc = createParamExtractor({
  hosts: 'cdn.embedly.com',
  path: '/widgets/media.html',
  params: ['src'],
})

// Embedly embed frame around the provider's iframe
// (cdn.embedly.com/widgets/media.html?src=<target>). A protocol-relative `src=//<host>/<path>`, as
// Embedly writes for Issuu, Libsyn and Datawrapper, gets `https:`.
export const unwrapEmbedly: UrlUnwrapper = (url) => {
  let target = extractSrc(url)

  if (target && protocolRelativeRegex.test(target)) {
    target = `https:${target}`
  }

  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
