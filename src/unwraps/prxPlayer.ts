import { createQueryUnwrapper } from '../utils.js'

// PRX Play podcast player and its embed (play.prx.org/listen?ge=<episode guid>&uf=<feed>, also /e).
// Opt-in: unwrapping returns the show's feed, not the player page a reader would open.
export const unwrapPrxPlayer = createQueryUnwrapper({
  hosts: 'play.prx.org',
  path: ['/listen', '/e'],
  params: ['uf'],
  ignoreLinkFragment: true,
})
