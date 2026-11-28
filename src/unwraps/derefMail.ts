import { isAnyOf, isHostOf } from 'trousse'
import { createQueryUnwrapper, createUnwrapper, readParamTarget } from '../utils.js'

const hosts = [
  'deref-1und1.de',
  'www.deref-1und1.de',
  'deref-1und1-02.de',
  'www.deref-1und1-02.de',
  'deref-gmx.co.uk',
  'www.deref-gmx.co.uk',
  'deref-gmx.com',
  'www.deref-gmx.com',
  'deref-gmx.fr',
  'www.deref-gmx.fr',
  'deref-gmx.net',
  'www.deref-gmx.net',
  'deref-mail.com',
  'www.deref-mail.com',
  'deref-mail-02.com',
  'www.deref-mail-02.com',
  'deref-web.de',
  'www.deref-web.de',
  'deref-web-02.de',
  'www.deref-web-02.de',
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
const pathRegex = /^\/mail\/client\/(?:[\w-]+\/)?dereferrer\/$/i
const lightmailerPathRegex = /^\/[\w-]+\/deref\/$/i

// The older GMX dereferrer (service.gmx.net/de/cgi/derefer?TYPE=3&DEST=<target>).
const extractLegacy = createQueryUnwrapper({
  hosts: 'service.gmx.net',
  path: '/de/cgi/derefer',
  params: ['DEST'],
})

// The leaving page on mail.com and GMX (service.mail.com/dereferrer/?target=<target>).
const extractLeaving = createQueryUnwrapper({
  hosts: ['service.mail.com', 'www.gmx.com', 'gmx.com', 'www.gmx.es', 'gmx.es'],
  path: '/dereferrer/',
  params: ['target'],
})

// The United Internet leaving page ([www.]ui-deref.de/r/?to=<target>).
const extractUiDeref = createQueryUnwrapper({
  hosts: ['www.ui-deref.de', 'ui-deref.de'],
  path: '/r/',
  params: ['to'],
})

// The old WEB.DE FreeMail jump (freemailng<n>.web.de/jump.htm?goto=<target>).
const extractFreemailJump = createQueryUnwrapper({
  hosts: /^freemailng\d+\.web\.de$/,
  path: '/jump.htm',
  params: ['goto'],
})

// GMX, WEB.DE, mail.com and 1&1 webmail dereferrer (deref-gmx.net/mail/client/[<token>/]
// dereferrer/?redirectUrl=<target>, slashless on the 3c client hosts, and
// lightmailer.mail.com/<token>/deref/?redirectUrl=<target>), plus the older shapes above.
export const unwrapDerefMail = createUnwrapper({
  domains: [...hosts, 'gmx.com', 'gmx.es', 'gmx.net', 'mail.com', 'ui-deref.de', 'web.de'],
  unwrap: (url) => {
    const isDerefHost = isHostOf(url, hosts) && pathRegex.test(url.pathname)
    const isClientHost =
      isHostOf(url, clientHosts) && isAnyOf(url.pathname, '/mail/client/dereferrer')
    const isLightmailerHost =
      isHostOf(url, lightmailerHosts) && lightmailerPathRegex.test(url.pathname)

    if (!isDerefHost && !isClientHost && !isLightmailerHost) {
      return (
        extractLegacy(url) ?? extractLeaving(url) ?? extractUiDeref(url) ?? extractFreemailJump(url)
      )
    }

    return readParamTarget(url, 'redirectUrl')
  },
})
