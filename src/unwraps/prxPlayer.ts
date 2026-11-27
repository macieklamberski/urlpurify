import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = ['play.prx.org']

const extractListen = createQueryUnwrapper({
  hosts,
  path: '/listen',
  params: ['uf'],
  ignoreLinkFragment: true,
})

const extractEmbed = createQueryUnwrapper({
  hosts,
  path: '/e',
  params: ['uf'],
  ignoreLinkFragment: true,
})

// PRX Play podcast player and its embed (play.prx.org/listen?ge=<episode guid>&uf=<feed>, also
// /e). Opt-in: unwrapping returns the show's feed, not the player page a reader would open.
export const unwrapPrxPlayer = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    return extractListen(url) ?? extractEmbed(url)
  },
})
