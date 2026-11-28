import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = ['player.fm', 'www.player.fm']

const extractImporter = createQueryUnwrapper({
  hosts,
  path: '/importer/feed',
  params: ['url'],
  ignoreLinkFragment: true,
})

const extractSubscribe = createQueryUnwrapper({
  hosts,
  path: '/subscribe',
  params: ['id'],
  ignoreLinkFragment: true,
})

// Player FM feed importer and subscribe link (player.fm/importer/feed?url=<feed>, also
// /subscribe?id=<feed>).
// Opt-in: the link adds the feed to a Player FM account, it never redirects to it.
export const unwrapPlayerFm = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    return extractImporter(url) ?? extractSubscribe(url)
  },
})
