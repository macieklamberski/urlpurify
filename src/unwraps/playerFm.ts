import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const extractImporter = createQueryUnwrapper({
  hosts: 'player.fm',
  path: '/importer/feed',
  params: ['url'],
  ignoreLinkFragment: true,
})

const extractSubscribe = createQueryUnwrapper({
  hosts: 'player.fm',
  path: '/subscribe',
  params: ['id'],
  ignoreLinkFragment: true,
})

// Player FM feed importer and subscribe link (player.fm/importer/feed?url=<feed>, also
// /subscribe?id=<feed>). Opt-in in the subscribe intent group: the link adds the feed to a Player
// FM account, it never redirects to it.
export const unwrapPlayerFm: UrlUnwrapper = (url) => {
  return extractImporter(url) ?? extractSubscribe(url)
}
