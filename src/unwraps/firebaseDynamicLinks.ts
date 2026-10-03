import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const appPathRegex = /^\/app\/[\w-]+$/

const extractTarget = createParamExtractor({
  hosts: /\.page\.link$|^[\w-]+(?:\.[\w-]+)*\.app\.goo\.gl$|^goo\.gl$/,
  params: ['link', 'ofl'],
})

// Firebase Dynamic Links (<project>.page.link/?link=<canonical>&ofl=<fallback>), and the older
// goo.gl hosts (<name>.app.goo.gl/?link=<canonical> and goo.gl/app/<name>?link=<canonical>).
// `link` is the canonical destination; `ofl` is the web fallback used when no
// app handler is available. They're often identical, but when they differ
// `link` is the more correct choice.
export const unwrapFirebaseDynamicLinks: UrlUnwrapper = (url) => {
  // Every other goo.gl path is the URL shortener, which holds only an id.
  if (url.hostname === 'goo.gl' && !appPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
