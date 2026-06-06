import type { UrlUnwrapper } from '../types.js'

const nicoMsRegex = /^\/((?:sm|nm|so|im)\w+)$/

// nico.ms short link rewrite. `/sm`, `/nm`, `/so` prefixes route to the
// nicovideo watch page; `/im` routes to the seiga illustration page.
export const unwrapNicoMs: UrlUnwrapper = (url) => {
  if (url.hostname !== 'nico.ms') {
    return
  }

  const match = url.pathname.match(nicoMsRegex)
  if (!match) {
    return
  }

  const id = match[1]

  if (id.startsWith('im')) {
    return `https://seiga.nicovideo.jp/seiga/${id}`
  }

  return `https://www.nicovideo.jp/watch/${id}`
}
