import { isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const nicoMsRegex = /^\/((?:sm|nm|so|im|lv)\w+)$/

// nico.ms short link. `/sm`, `/nm` and `/so` route to the watch page, `/im` to the seiga
// illustration page, `/lv` to the live broadcast page.
export const unwrapNicoMs: UrlUnwrapper = (url) => {
  if (!isHostOf(url, 'nico.ms')) {
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

  if (id.startsWith('lv')) {
    return `https://live.nicovideo.jp/watch/${id}`
  }

  return `https://www.nicovideo.jp/watch/${id}`
}
