import { isHostOrSubdomainOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const domains = [
  'deref-1und1.de',
  'deref-1und1-02.de',
  'deref-gmx.co.uk',
  'deref-gmx.com',
  'deref-gmx.fr',
  'deref-gmx.net',
  'deref-mail.com',
  'deref-mail-02.com',
  'deref-web.de',
  'deref-web-02.de',
]

// The optional segment is a session token, such as `12XJ9x8ZdSA`.
const pathRegex = /^\/mail\/client\/(?:[\w-]+\/)?dereferrer\/$/
const encodedSchemeRegex = /^https?%3A/i

// GMX, WEB.DE, mail.com and 1&1 webmail dereferrer
// (deref-gmx.net/mail/client/[<token>/]dereferrer/?redirectUrl=<target>).
export const unwrapDerefMail: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, domains) || !pathRegex.test(url.pathname)) {
    return
  }

  let target = url.searchParams.get('redirectUrl')

  if (!target) {
    return
  }

  // Some messages encode the target twice.
  if (encodedSchemeRegex.test(target)) {
    try {
      target = decodeURIComponent(target)
    } catch {}
  }

  if (isHttpUrl(target)) {
    return target
  }
}
