import { isHostOf } from 'trousse'
import { addArchivedScheme, resolvePathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

// A 14-digit timestamp after the web prefix.
const webPathRegex = /^\/web\/\d{14}\/(?<target>.+)$/i
// The persistent id of a collection, as in /info:ndljp/pid/286890/.
const pidPathRegex = /^\/info:ndljp\/pid\/\d+\/(?<target>.+)$/i

// WARP, the National Diet Library web archive, snapshot (warp.ndl.go.jp/web/<timestamp>/<target>),
// also the persistent-id form (warp.ndl.go.jp/info:ndljp/pid/<id>/<target>, also on
// warp.da.ndl.go.jp), with or without the target's scheme.
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapNdlWarp = createUnwrapper({
  hosts: ['warp.ndl.go.jp', 'warp.da.ndl.go.jp'],
  unwrap: (url) => {
    const pidMatch = pidPathRegex.exec(url.pathname)
    const webMatch = isHostOf(url, 'warp.ndl.go.jp') ? webPathRegex.exec(url.pathname) : null
    const path = pidMatch?.groups?.target ?? webMatch?.groups?.target

    if (!path) {
      return
    }

    // WARP's redirect of a scheme-less persistent id names http, as in
    // WE11.jsp?originalUrl=http://, and such an id now redirects to the scheme-less snapshot.
    return addArchivedScheme(resolvePathTarget(url, path))
  },
})
