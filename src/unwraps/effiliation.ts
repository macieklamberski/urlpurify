import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const pathRegex = /^\/servlet\/effi\.(?:redir|product)$/i

const hosts = ['track.effiliation.com']

const extractUrl = createQueryUnwrapper({
  hosts,
  params: ['url'],
})

// Effiliation French affiliate network (track.effiliation.com/servlet/effi.redir?url=<target>,
// also /servlet/effi.product).
export const unwrapEffiliation = createUnwrapper({
  hosts,
  unwrap: (url) => {
    if (!pathRegex.test(url.pathname)) {
      return
    }

    return extractUrl(url)
  },
})
