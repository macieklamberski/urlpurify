import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, decodeBase64Url } from '../utils.js'

const hosts = ['go.mnsvc.com', 'mandrillapp.com']
const clickPathRegex = /^\/track\/click\/\d+\/[^/]+$/

const extractClickPhp = createParamExtractor({
  hosts,
  path: '/track/click.php',
  params: ['url'],
})

// The p param is base64url JSON whose own p field is a JSON string holding the target as url.
const decodePayload = (value: string): string | undefined => {
  try {
    const target = JSON.parse(JSON.parse(decodeBase64Url(value) ?? '').p).url

    if (isHttpUrl(target)) {
      return target
    }
  } catch {}
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

  const payload = url.searchParams.get('p')

  if (!payload) {
    return
  }

  return decodePayload(payload)
}
