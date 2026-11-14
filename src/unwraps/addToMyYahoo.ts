import { isAnyOf, isHostOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor, getParamTarget } from '../utils.js'

const hosts = ['add.my.yahoo.com', 'add.my.yahoo.co.jp']
const redirectHosts = ['us.rd.yahoo.com', 'rd.yahoo.co.jp']

// The add link follows the `*` unencoded, so its own query is the redirect's query.
const redirectPathRegex =
  /^\/(?:my|myyahoo)\/[^*]*\*https?:\/\/add\.my\.yahoo\.co(?:m|\.jp)\/(?:rss|content)$/i

const unwrapRss = createParamExtractor({ hosts, path: '/rss', params: ['url'] })
const unwrapContent = createParamExtractor({
  hosts: 'add.my.yahoo.com',
  path: '/content',
  params: ['url'],
})

// Add to My Yahoo subscribe button (add.my.yahoo.com/rss?url=<feed>, add.my.yahoo.co.jp/rss?url=
// and add.my.yahoo.com/content?url=), also behind Yahoo's click redirect
// (us.rd.yahoo.com/my/.../*<add link>, rd.yahoo.co.jp/myyahoo/.../*<add link>). Opt-in: the button
// opens My Yahoo's page that adds the feed, not the feed.
export const unwrapAddToMyYahoo: UrlUnwrapper = (url) => {
  if (isHostOf(url, redirectHosts)) {
    if (!isAnyOf(url.pathname, redirectPathRegex)) {
      return
    }

    return getParamTarget(url, 'url')
  }

  return unwrapRss(url) ?? unwrapContent(url)
}
