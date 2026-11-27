import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, readParamTarget } from '../utils.js'

const hosts = ['add.my.yahoo.com', 'add.my.yahoo.co.jp']

// The add link follows the `*` unencoded, so its own query is the redirect's query.
const usRedirectPathRegex =
  /^\/my\/[^*]*\*https?:\/\/add\.my\.yahoo\.(?:com\/(?:rss|content)|co\.jp\/rss)$/i
const jpRedirectPathRegex =
  /^\/myyahoo\/[^*]*\*https?:\/\/add\.my\.yahoo\.(?:com\/(?:rss|content)|co\.jp\/rss)$/i

const unwrapRss = createQueryUnwrapper({
  hosts,
  path: '/rss',
  params: ['url'],
  ignoreLinkFragment: true,
})
const unwrapContent = createQueryUnwrapper({
  hosts: 'add.my.yahoo.com',
  path: '/content',
  params: ['url'],
  ignoreLinkFragment: true,
})

// Add to My Yahoo subscribe button (add.my.yahoo.com/rss?url=<feed>, add.my.yahoo.co.jp/rss?url=
// and add.my.yahoo.com/content?url=), also behind Yahoo's click redirect
// (us.rd.yahoo.com/my/.../*<add link>, rd.yahoo.co.jp/myyahoo/.../*<add link>). Opt-in: the button
// opens My Yahoo's page that adds the feed, not the feed.
export const unwrapAddToMyYahoo: UrlUnwrapper = (url) => {
  if (isHostOf(url, 'us.rd.yahoo.com')) {
    if (!isAnyOf(url.pathname, usRedirectPathRegex)) {
      return
    }

    return readParamTarget(url, 'url')
  }

  if (isHostOf(url, 'rd.yahoo.co.jp')) {
    if (!isAnyOf(url.pathname, jpRedirectPathRegex)) {
      return
    }

    return readParamTarget(url, 'url')
  }

  return unwrapRss(url) ?? unwrapContent(url)
}
