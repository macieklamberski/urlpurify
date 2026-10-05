import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const hosts = [
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

const clientHosts = [
  '3c.gmx.net',
  '3c-bs.gmx.com',
  '3c-bs.gmx.es',
  '3c.web.de',
  '3c-bap.web.de',
  '3c-lxa.mail.com',
]

// The optional segment is a session token, such as `12XJ9x8ZdSA`.
const pathRegex = /^\/mail\/client\/(?:[\w-]+\/)?dereferrer\/$/
const encodedSchemeRegex = /^https?%3A/i

const extractLegacy = createParamExtractor({
  hosts: 'service.gmx.net',
  path: '/de/cgi/derefer',
  params: ['DEST'],
})

// GMX, WEB.DE, mail.com and 1&1 webmail dereferrer (deref-gmx.net/mail/client/[<token>/]
// dereferrer/?redirectUrl=<target>, slashless on the 3c client hosts), and the older GMX
// dereferrer (service.gmx.net/de/cgi/derefer?TYPE=3&DEST=<target>).
export const unwrapDerefMail: UrlUnwrapper = (url) => {
  const isDerefHost = isHostOf(url, hosts) && pathRegex.test(url.pathname)
  const isClientHost = isHostOf(url, clientHosts) && url.pathname === '/mail/client/dereferrer'

  if (!isDerefHost && !isClientHost) {
    return extractLegacy(url)
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
