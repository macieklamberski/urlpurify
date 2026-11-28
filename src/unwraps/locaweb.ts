import { getQueryParam, isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

// H|<n>|<n>|<n> on a campaign send, TH|teste|<n>|<n> on a test send.
const idRegex = /^T?H\|(?:\d+|teste)\|\d+\|\d+$/

// Locaweb Email Marketing click tracker on any host
// (<sender host>/registra_clique.php?id=<ids>&url=<target>). Senders run it on subdomains of
// Locaweb's mailing domains and on their own hosts. Opt-in: unwrapping removes the click count.
export const unwrapLocaweb: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    if (
      !isAnyOf(url.pathname, '/registra_clique.php') ||
      !idRegex.test(getQueryParam(url, 'id') ?? '')
    ) {
      return
    }

    return readParamTarget(url, 'url')
  },
})
