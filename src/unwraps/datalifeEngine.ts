import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { decodeBase64 } from '../utils.js'

// DataLife Engine leaving redirect (<site host>/engine/go.php?url=<base64>). Each site runs the CMS
// on its own host, so the exact path and a base64 http `url` are the guard, not the host.
export const unwrapDatalifeEngine: UrlUnwrapper = (url) => {
  if (url.pathname !== '/engine/go.php') {
    return
  }

  const raw = url.searchParams.get('url')

  if (!raw) {
    return
  }

  const decoded = decodeBase64(raw)

  if (decoded && isHttpUrl(decoded)) {
    return decoded
  }
}
