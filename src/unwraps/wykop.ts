import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['www.wykop.pl', 'wykop.pl']

const pathRegex = /^\/(?:remotelink|dodaj(?:\/link|-link)?)\/?$/i

// Wykop add-link form (wykop.pl/dodaj?url=<target>, also /dodaj/link, /dodaj-link and the
// former /remotelink, on www. and bare wykop.pl). Opt-in: unwrapping returns the shared page, not
// the form.
export const unwrapWykop: UrlUnwrapper = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    if (!isAnyOf(url.pathname, pathRegex)) {
      return
    }

    // The `title=` and `desc=` beside it are the find's own text, never a carrier.
    return readParamTarget(url, 'url')
  },
})
