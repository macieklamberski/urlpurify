import { isAnyOf } from 'trousse'
import { createUnwrapper, readParamTarget } from '../utils.js'

const pathRegex = /^\/(?:remotelink|dodaj(?:\/link|-link)?)\/?$/i

// Wykop add-link form (wykop.pl/dodaj?url=<target>, also /dodaj/link, /dodaj-link and the former
// /remotelink, on www. and bare wykop.pl).
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapWykop = createUnwrapper({
  hosts: ['wykop.pl', 'www.wykop.pl'],
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, pathRegex)) {
      return
    }

    // The `title=` and `desc=` beside it are the find's own text, never a carrier.
    return readParamTarget(url, 'url')
  },
})
