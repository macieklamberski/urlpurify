import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64 } from '../utils.js'

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
  if (!isHostOf(url, hosts) || !paths.includes(url.pathname) || !url.searchParams.has('AGENCY')) {
    return
  }

  // A `+` of the base64 alphabet, left unencoded, reads as a space.
  const value = url.searchParams.get('drurl')?.replaceAll(' ', '+')

  if (!value) {
    return
  }

  const target = decodeBase64(value)

  if (target && isHttpUrl(target)) {
    return target
  }
}
