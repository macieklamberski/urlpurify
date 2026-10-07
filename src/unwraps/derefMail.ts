import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, percentDecode } from '../utils.js'

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

const lightmailerHosts = ['lightmailer.mail.com', 'lightmailer-bs.gmx.net']

// The optional segment is a session token, such as `12XJ9x8ZdSA`.
const pathRegex = /^\/mail\/client\/(?:[\w-]+\/)?dereferrer\/$/
const lightmailerPathRegex = /^\/[\w-]+\/deref\/$/
const encodedSchemeRegex = /^https?%3A/i

// The older GMX dereferrer (service.gmx.net/de/cgi/derefer?TYPE=3&DEST=<target>).
const extractLegacy = createParamExtractor({
  hosts: 'service.gmx.net',
  path: '/de/cgi/derefer',
  params: ['DEST'],
})

// The leaving page on mail.com and GMX (service.mail.com/dereferrer/?target=<target>).
const extractLeaving = createParamExtractor({
  hosts: ['service.mail.com', 'www.gmx.com', 'www.gmx.es'],
  path: '/dereferrer/',
  params: ['target'],
})

// The United Internet leaving page (www.ui-deref.de/r/?to=<target>).
const extractUiDeref = createParamExtractor({
  hosts: 'www.ui-deref.de',
  path: '/r/',
  params: ['to'],
})

// The old WEB.DE FreeMail jump (freemailng<n>.web.de/jump.htm?goto=<target>).
const extractFreemailJump = createParamExtractor({
  hosts: /^freemailng\d+\.web\.de$/,
  path: '/jump.htm',
  params: ['goto'],
})

// GMX, WEB.DE, mail.com and 1&1 webmail dereferrer (deref-gmx.net/mail/client/[<token>/]
// dereferrer/?redirectUrl=<target>, slashless on the 3c client hosts, and
// lightmailer.mail.com/<token>/deref/?redirectUrl=<target>), plus the older shapes above.
export const unwrapDerefMail: UrlUnwrapper = (url) => {
  const isDerefHost = isHostOf(url, hosts) && pathRegex.test(url.pathname)
  const isClientHost = isHostOf(url, clientHosts) && url.pathname === '/mail/client/dereferrer'
  const isLightmailerHost =
    isHostOf(url, lightmailerHosts) && lightmailerPathRegex.test(url.pathname)

  if (!isDerefHost && !isClientHost && !isLightmailerHost) {
    return (
      extractLegacy(url) ?? extractLeaving(url) ?? extractUiDeref(url) ?? extractFreemailJump(url)
    )
  }

  let target = url.searchParams.get('redirectUrl')

  if (!target) {
    return
  }

  // Some messages encode the target twice.
  if (encodedSchemeRegex.test(target)) {
    target = percentDecode(target)
  }

  if (isHttpUrl(target)) {
    return target
  }
}
