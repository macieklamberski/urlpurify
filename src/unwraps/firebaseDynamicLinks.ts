import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const appPathRegex = /^\/app\/[\w-]+$/
const params = ['link', 'ofl']

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
// `link` is the canonical destination; `ofl` is the web fallback used when no
// app handler is available. They're often identical, but when they differ
// `link` is the more correct choice.
export const unwrapFirebaseDynamicLinks: UrlUnwrapper = (url) => {
  if (url.hostname !== 'goo.gl') {
    return extractTarget(url)
  }

  // Every other goo.gl path is the URL shortener, which holds only an id.
  if (!appPathRegex.test(url.pathname)) {
    return
  }

  return extractGooGlTarget(url)
}
