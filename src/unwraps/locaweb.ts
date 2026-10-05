import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getParamValues } from '../utils.js'

// H|<n>|<n>|<n> on a campaign send, TH|teste|<n>|<n> on a test send.
const idRegex = /^T?H\|(?:\d+|teste)\|\d+\|\d+$/

// Locaweb Email Marketing click tracker on any host
// (<sender host>/registra_clique.php?id=<ids>&url=<target>). Senders run it on subdomains of
// Locaweb's mailing domains and on their own hosts. Opt-in: unwrapping removes the click count.
export const unwrapLocaweb: UrlUnwrapper = (url) => {
  if (url.pathname !== '/registra_clique.php' || !idRegex.test(url.searchParams.get('id') ?? '')) {
    return
  }

  const target = getParamValues(url, 'url').at(0)

  if (target && isHttpUrl(target)) {
    return target
  }
}
