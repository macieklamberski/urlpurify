import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const owaPaths = ['/owa/redir.aspx', '/OWA/redir.aspx', '/exchweb/bin/redir.asp']
const encodedSchemeRegex = /^https?%3A/i

// Outlook Web Access link shim on an organization's own Exchange server
// (<mail host>/owa/redir.aspx?C=<canary>&URL=<target>, and Exchange 2003's
// /exchweb/bin/redir.asp?URL=<target>). Each organization runs it on its own host, so the exact
// path and an http `URL` are the guard, not the host. Opt-in: the click needs a signed-in mailbox,
// and a reader without one lands on the server's login page.
export const unwrapOutlookWebAccess: UrlUnwrapper = (url) => {
  if (!owaPaths.includes(url.pathname)) {
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
