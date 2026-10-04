import { isHostOrSubdomainOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'

const nicoMsRegex = /^\/((?:sm|nm|so|im)\w+)$/

// nico.ms short link, on nico.ms and its subdomains. `/sm`, `/nm` and `/so` route to the watch
// page, `/im` to the seiga illustration page.
export const unwrapNicoMs: UrlUnwrapper = (url) => {
  if (!isHostOrSubdomainOf(url, 'nico.ms')) {
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
