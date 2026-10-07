import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// A 14-digit timestamp after the web prefix.
const webPathRegex = /^\/web\/\d{14}\/(.+)$/
// The persistent id of a collection, as in /info:ndljp/pid/286890/.
const pidPathRegex = /^\/info:ndljp\/pid\/\d+\/(.+)$/
const schemeRegex = /^[a-z][a-z\d+.-]*:/i

// WARP, the National Diet Library web archive, snapshot (warp.ndl.go.jp/web/<timestamp>/<target>),
// also the persistent-id form (warp.ndl.go.jp/info:ndljp/pid/<id>/<target>, also on
// warp.da.ndl.go.jp), with or without the target's scheme.
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapNdlWarp: UrlUnwrapper = (url) => {
  if (!isHostOf(url, ['warp.ndl.go.jp', 'warp.da.ndl.go.jp'])) {
    return
  }

  const pidMatch = pidPathRegex.exec(url.pathname)
  const webMatch = isHostOf(url, 'warp.ndl.go.jp') ? webPathRegex.exec(url.pathname) : null
  const path = pidMatch?.[1] ?? webMatch?.[1]

  if (!path) {
    return
  }

  // WARP's own redirect of a scheme-less snapshot names http, as in WE11.jsp?originalUrl=http://.
  const target = schemeRegex.test(path) ? path : `http://${path}`

  // An unencoded target's query and fragment land in the snapshot URL's own `search` and `hash`.
  const unwrapped = `${target}${url.search}${url.hash}`

  if (isHttpUrl(unwrapped)) {
    return unwrapped
  }
}
