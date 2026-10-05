import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Exchange 2010 adds its build to the path, and explicit logon adds the mailbox address.
const owaPathRegex =
  /^\/(?:owa\/(?:[^/]+@[^/]+\/|\d+(?:\.\d+){3}\/scripts\/premium\/)?redir\.aspx|exchweb\/bin\/redir\.asp)$/i
const encodedSchemeRegex = /^https?%3A/i

// Outlook Web Access link shim on an organization's own Exchange server
// (<mail host>/owa/redir.aspx?C=<canary>&URL=<target>, and Exchange 2003's
// /exchweb/bin/redir.asp?URL=<target>). Each organization runs it on its own host, so the exact
// path and an http `URL` are the guard, not the host. Opt-in: the click needs a signed-in mailbox,
// and a reader without one lands on the server's login page.
export const unwrapOutlookWebAccess: UrlUnwrapper = (url) => {
  if (!owaPathRegex.test(url.pathname)) {
    return
  }

  let target = url.searchParams.get('URL')

  if (!target) {
    return
  }

  // Some links encode the target twice.
  if (encodedSchemeRegex.test(target)) {
    try {
      target = decodeURIComponent(target)
    } catch {}
  }

  if (isHttpUrl(target)) {
    return target
  }
}
