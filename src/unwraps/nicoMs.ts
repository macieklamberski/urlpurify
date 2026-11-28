import { createUnwrapper } from '../utils.js'

const nicoMsRegex = /^\/(?<id>(?:sm|nm|so|im|lv)\w+)$/i

// nico.ms short link. `/sm`, `/nm` and `/so` route to the watch page, `/im` to the seiga
// illustration page, `/lv` to the live broadcast page.
export const unwrapNicoMs = createUnwrapper({
  hosts: ['nico.ms', 'www.nico.ms'],
  unwrap: (url) => {
    const match = nicoMsRegex.exec(url.pathname)
    if (!match?.groups) {
      return
    }

    const id = match.groups.id

    if (id.startsWith('im')) {
      return `https://seiga.nicovideo.jp/seiga/${id}`
    }

    if (id.startsWith('lv')) {
      return `https://live.nicovideo.jp/watch/${id}`
    }

    return `https://www.nicovideo.jp/watch/${id}`
  },
})
