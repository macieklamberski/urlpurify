import { decodeBase64, getQueryParam, isAnyOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper, readDecodedTarget } from '../utils.js'

// DataLife Engine leaving redirect (<site host>/engine/go.php?url=<base64>, also routed as
// /index.php?do=go&url=<base64>). Each site runs the CMS on its own host, so the exact path and a
// base64 http `url` are the guard, not the host.
export const unwrapDatalifeEngine: UrlUnwrapper = createUnwrapper({
  anyHost: true,
  unwrap: (url) => {
    const isEngineGo = isAnyOf(url.pathname, '/engine/go.php')
    const isIndexGo = isAnyOf(url.pathname, '/index.php') && getQueryParam(url, 'do') === 'go'

    if (!isEngineGo && !isIndexGo) {
      return
    }

    const target = readDecodedTarget(url, 'url', decodeBase64)

    if (target && isHttpUrl(target)) {
      return target
    }
  },
})
