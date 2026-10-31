import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const appPathRegex = /^\/app\/[\w-]+$/
// A desktop browser gets `ofl` when present and `link` otherwise.
// See: https://firebase.google.com/docs/dynamic-links/create-manually.
const params = ['ofl', 'link']

const extractTarget = createParamExtractor({
  domains: ['app.goo.gl', 'page.link'],
  path: '/',
  params,
})

// goo.gl itself is the URL shortener, so it matches exactly and only on /app/<name>.
const extractGooGlTarget = createParamExtractor({
  hosts: 'goo.gl',
  params,
})

// Firebase Dynamic Links (<project>.page.link/?link=<canonical>&ofl=<fallback>), and the older
// goo.gl hosts (<name>.app.goo.gl/?link=<canonical> and goo.gl/app/<name>?link=<canonical>).
// A deeper path on page.link or app.goo.gl is a short link or another service, such as
// maps.app.goo.gl/<id>, and is left alone.
export const unwrapFirebaseDynamicLinks: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'goo.gl')) {
    return extractTarget(url)
  }

  // Every other goo.gl path is the URL shortener, which holds only an id.
  if (!appPathRegex.test(url.pathname)) {
    return
  }

  return extractGooGlTarget(url)
}
