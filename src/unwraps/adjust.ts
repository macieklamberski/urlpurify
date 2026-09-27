import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// Adjust deep-link tracker (app.adjust.com/<token>?redirect=<target>). The
// `redirect` param sometimes contains a custom-scheme URI (e.g. `myapp://...`)
// that's only meaningful inside the target app; only forward http(s) values.
export const unwrapAdjust: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'app.adjust.com')) {
    return
  }

  const target = url.searchParams.get('redirect')
  if (!target || !isHttpUrl(target)) {
    return
  }

  return target
}
