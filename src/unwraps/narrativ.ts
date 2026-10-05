import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const redirectPathRegex = /^\/api\/v\d+\/(?:client_)?redirect\/?$/
const linkPaths = ['/link', '/link/']

const extractTarget = createParamExtractor({
  hosts: ['narrativ.com', 'api.narrativ.com', 'events.release.narrativ.com'],
  params: ['url'],
})

const extractLinkTarget = createParamExtractor({
  hosts: ['howl.link', 'howl.me', 'shop-links.co'],
  params: ['url'],
})

// Narrativ affiliate redirect (api.narrativ.com/api/v0/{client_redirect,redirect}/?url=<target>)
// on narrativ.com, api.narrativ.com and events.release.narrativ.com, and its Howl commerce link
// (howl.link/link?url=<target>, also /link/, howl.me and shop-links.co). Not in
// defaultUnwrappers: real-time auction bidding routes the click, so `url` may not be where it
// lands.
export const unwrapNarrativ: UrlUnwrapper = (url) => {
  if (linkPaths.includes(url.pathname)) {
    return extractLinkTarget(url)
  }

  if (!redirectPathRegex.test(url.pathname)) {
    return
  }

  return extractTarget(url)
}
