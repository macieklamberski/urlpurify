import { getQueryParam, isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { getBase64Target } from '../utils.js'

// DataLife Engine leaving redirect (<site host>/engine/go.php?url=<base64>, also routed as
// /index.php?do=go&url=<base64>). Each site runs the CMS on its own host, so the exact path and a
// base64 http `url` are the guard, not the host.
export const unwrapDatalifeEngine: UrlUnwrapper = (url) => {
  const isEngineGo = isAnyOf(url.pathname, '/engine/go.php')
  const isIndexGo = isAnyOf(url.pathname, '/index.php') && getQueryParam(url, 'do') === 'go'

  if (!isEngineGo && !isIndexGo) {
    return
  }

  return getBase64Target(url, 'url')
}
