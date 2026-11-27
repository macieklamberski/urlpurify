import { isHttpUrl } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createUnwrapper } from '../utils.js'

// A 14-digit timestamp after the replay prefix.
const pathRegex = /^\/wayback\/\d{14}\/(.+)$/i

// Arquivo.pt, the Portuguese web archive, snapshot (arquivo.pt/wayback/<timestamp>/<target>).
// Opt-in: unwrapping returns the live page, which may have changed or be gone.
export const unwrapArquivo: UrlUnwrapper = createUnwrapper({
  hosts: 'arquivo.pt',
  unwrap: (url) => {
    const match = pathRegex.exec(url.pathname)

    if (!match?.[1]) {
      return
    }

    // An unencoded target's query lands in the snapshot URL's own `search`.
    const target = `${match[1]}${url.search}`

    if (isHttpUrl(target)) {
      return target
    }
  },
})
