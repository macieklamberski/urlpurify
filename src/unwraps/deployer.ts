import { decodeBase64, hasQueryParam, isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getDecodedParamTarget } from '../utils.js'

const hosts = [
  'daily.news.humanevents.com',
  'myjw.pr.judicialwatch.org',
  'the.daily.thepostmillennial.com',
]
const paths = ['/link.php', '/wta/link.php']

// Deployer email click tracker on senders' own subdomains
// (<sender host>/link.php?AGENCY=<sender>&M=<n>&N=<n>&L=<n>&F=H&drurl=<base64>, also
// /wta/link.php). Opt-in: unwrapping removes the sender's click count.
export const unwrapDeployer: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || !isAnyOf(url.pathname, paths) || !hasQueryParam(url, 'AGENCY')) {
    return
  }

  return getDecodedParamTarget(url, 'drurl', decodeBase64)
}
