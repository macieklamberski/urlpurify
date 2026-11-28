import { decodeBase64, hasQueryParam, isAnyOf } from 'trousse'
import { createUnwrapper, readDecodedParamTarget } from '../utils.js'

const paths = ['/link.php', '/wta/link.php']

// Deployer email click tracker on senders' own subdomains (<sender
// host>/link.php?AGENCY=<sender>&M=<n>&N=<n>&L=<n>&F=H&drurl=<base64>, also /wta/link.php).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapDeployer = createUnwrapper({
  hosts: [
    'daily.news.humanevents.com',
    'myjw.pr.judicialwatch.org',
    'the.daily.thepostmillennial.com',
  ],
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, paths) || !hasQueryParam(url, 'AGENCY')) {
      return
    }

    return readDecodedParamTarget(url, 'drurl', decodeBase64)
  },
})
