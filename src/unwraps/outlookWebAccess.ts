import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamTarget } from '../utils.js'

const owaPathRegex =
  /^\/(?:owa\/(?:[^/]+@[^/]+\/|\d+(?:\.\d+){3}\/scripts\/premium\/)?redir\.aspx|exchweb\/bin\/redir\.asp)$/i

// Outlook Web Access link shim on an organization's own Exchange server
// (<mail host>/owa/redir.aspx?C=<canary>&URL=<target>, Exchange 2010's
// /owa/<build>/scripts/premium/redir.aspx, explicit logon's /owa/<mailbox>/redir.aspx, and
// Exchange 2003's /exchweb/bin/redir.asp?URL=<target>). Each organization runs it on its own host,
// so the exact path and an http `URL` are the guard, not the host. Opt-in: the click needs a
// signed-in mailbox, and a reader without one lands on the server's login page.
export const unwrapOutlookWebAccess: UrlUnwrapper = (url) => {
  if (!owaPathRegex.test(url.pathname)) {
    return
  }

  const target = getParamTarget(url, 'URL')

  if (!target) {
    return
  }

  if (isHttpUrl(target)) {
    return target
  }
}
