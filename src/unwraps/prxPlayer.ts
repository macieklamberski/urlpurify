import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractListen = createParamExtractor({
  hosts: 'play.prx.org',
  path: '/listen',
  params: ['uf'],
  ignoreLinkFragment: true,
})

const extractEmbed = createParamExtractor({
  hosts: 'play.prx.org',
  path: '/e',
  params: ['uf'],
  ignoreLinkFragment: true,
})

// PRX Play podcast player and its embed (play.prx.org/listen?ge=<episode guid>&uf=<feed>, also
// /e). Opt-in: unwrapping returns the show's feed, not the player page a reader would open.
export const unwrapPrxPlayer: UrlUnwrapper = (url) => {
  return extractListen(url) ?? extractEmbed(url)
}
