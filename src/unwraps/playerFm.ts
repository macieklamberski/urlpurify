import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const extractImporter = createParamExtractor({
  hosts: 'player.fm',
  path: '/importer/feed',
  params: ['url'],
})

const extractSubscribe = createParamExtractor({
  hosts: 'player.fm',
  path: '/subscribe',
  params: ['id'],
})

// Player FM feed importer and subscribe link (player.fm/importer/feed?url=<feed>, also
// /subscribe?id=<feed>). Opt-in in the subscribe intent group: the link adds the feed to a Player
// FM account, it never redirects to it.
export const unwrapPlayerFm: UrlUnwrapper = (url) => {
  return extractImporter(url) ?? extractSubscribe(url)
}
