import { isHostOrSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// anonym.to referrer anonymizer (anonym.to/?<target>) on the domain and its subdomains. The target
// is the whole query string, not a named parameter, and it is not encoded, so it is taken verbatim.
export const unwrapAnonymTo: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, 'anonym.to') || url.pathname !== '/') {
    return
  }

  const target = url.search.slice(1)

  if (!target) {
    return
  }

  // The target's own fragment lands in the wrapper's `hash`.
  return `${target}${url.hash}`
}
