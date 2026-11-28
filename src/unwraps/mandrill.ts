import { decodeBase64Url, isString, parseJson } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['go.mnsvc.com', 'mandrillapp.com', 'www.mandrillapp.com']

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

  if (isString(target)) {
    return target
  }
}

// Mandrill, Mailchimp Transactional, click tracker (mandrillapp.com/track/click.php?url=<target>,
// also /track/click/<account>/<target host>?p=<base64url JSON>), also a sender's custom tracking
// domain such as go.mnsvc.com. Opt-in: unwrapping removes the sender's click count.
export const unwrapMandrill: UrlUnwrapper = createUnwrapper({
  hosts,
  unwrap: (url) => {
    const target = extractClickPhp(url)

    if (target) {
      return target
    }

    if (!clickPathRegex.test(url.pathname)) {
      return
    }

    const payload = readParamTarget(url, 'p')

    if (!payload) {
      return
    }

    return decodePayload(payload)
  },
})
