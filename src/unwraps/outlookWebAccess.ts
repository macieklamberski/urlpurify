import { isHttpUrl } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const owaPathRegex =
  /^\/(?:owa\/(?:[^/]+@[^/]+\/|\d+(?:\.\d+){3}\/scripts\/premium\/)?redir\.aspx|exchweb\/bin\/redir\.asp)$/i

// Outlook Web Access link shim on an organization's own Exchange server
// (<mail host>/owa/redir.aspx?C=<canary>&URL=<target>, Exchange 2010's
// /owa/<build>/scripts/premium/redir.aspx, explicit logon's /owa/<mailbox>/redir.aspx, and Exchange
// 2003's /exchweb/bin/redir.asp?URL=<target>). Each organization runs it on its own host, so the
// exact path and an http `URL` are the guard, not the host.
// Opt-in: the shim's page needs a sign-in, which unwrapping skips.
export const unwrapOutlookWebAccess = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (!owaPathRegex.test(url.pathname)) {
      return
    }

    const target = readParamTarget(url, 'URL')

    if (!target) {
      return
    }

    if (isHttpUrl(target)) {
      return target
    }
  },
})
