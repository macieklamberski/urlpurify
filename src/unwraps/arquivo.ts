import { isHostOf, isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

// A 14-digit timestamp after the replay prefix.
const pathRegex = /^\/wayback\/\d{14}\/(.+)$/

// Arquivo.pt, the Portuguese web archive, snapshot (arquivo.pt/wayback/<timestamp>/<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapArquivo: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'arquivo.pt')) {
    return
  }

  const match = pathRegex.exec(url.pathname)

  if (!match?.[1]) {
    return
  }

  // An unencoded target's query and fragment land in the snapshot URL's own `search` and `hash`.
  const target = `${match[1]}${url.search}${url.hash}`

  if (isHttpUrl(target)) {
    return target
  }
}
