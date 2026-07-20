import type { UrlUnwrapper } from '../types.js'

// href.li referrer stripper (href.li/?<target>), which Tumblr wraps outbound links in, both
// on its own and nested inside a t.umblr.com redirect. The target is the whole query string
// rather than a named parameter, and it is not encoded, so it is taken verbatim.
export const unwrapHrefLi: UrlUnwrapper = (url) => {
  if (url.hostname !== 'href.li' && url.hostname !== 'www.href.li') {
    return
  }

  return url.search.slice(1) || undefined
}
