import { decodeBase64Url, isHostOf, isHttpUrl, isString, parseJson } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, getParamValues } from '../utils.js'

const hosts = ['go.mnsvc.com', 'mandrillapp.com']

const clickPathRegex = /^\/track\/click\/\d+\/[^/]+$/i

const extractClickPhp = createQueryUnwrapper({
  hosts,
  path: '/track/click.php',
  params: ['url'],
})

// The p param is base64url JSON whose own p field is a JSON string holding the target as url.
const decodePayload = (value: string): string | undefined => {
  const payload = parseJson<{ p?: string }>(decodeBase64Url(value))?.p
  const target = parseJson<{ url?: unknown }>(payload)?.url

  if (isString(target) && isHttpUrl(target)) {
    return target
  }
}

// Mandrill, Mailchimp Transactional, click tracker (mandrillapp.com/track/click.php?url=<target>,
// also /track/click/<account>/<target host>?p=<base64url JSON>), also a sender's custom tracking
// domain such as go.mnsvc.com. Opt-in: unwrapping removes the sender's click count.
export const unwrapMandrill: UrlUnwrapper = (url) => {
  const target = extractClickPhp(url)

  if (target) {
    return target
  }

  if (!isHostOf(url, hosts) || !clickPathRegex.test(url.pathname)) {
    return
  }

  const payload = getParamValues(url, 'p').at(0)

  if (!payload) {
    return
  }

  return decodePayload(payload)
}
