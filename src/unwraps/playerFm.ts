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
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapPlayerFm = createUnwrapper({
  hosts,
  ignoreLinkFragment: true,
  unwrap: (url) => {
    return extractImporter(url) ?? extractSubscribe(url)
  },
})
