import { isAnyOf } from 'trousse'
import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const redirectPathRegex = /^\/api\/v\d+\/(?:client_)?redirect\/?$/i

const linkPaths = ['/link', '/link/']

const redirectHosts = [
  'narrativ.com',
  'www.narrativ.com',
  'api.narrativ.com',
  'events.release.narrativ.com',
]
const linkHosts = [
  'howl.link',
  'www.howl.link',
  'howl.me',
  'www.howl.me',
  'shop-links.co',
  'www.shop-links.co',
]

const extractTarget = createQueryUnwrapper({
  hosts: redirectHosts,
  params: ['url'],
})

const extractLinkTarget = createQueryUnwrapper({
  hosts: linkHosts,
  params: ['url'],
})

// Narrativ affiliate redirect (api.narrativ.com/api/v0/{client_redirect,redirect}/?url=<target>)
// on narrativ.com, api.narrativ.com and events.release.narrativ.com, and its Howl commerce link
// (howl.link/link?url=<target>, also /link/, howl.me and shop-links.co). Not in
// defaultUnwrappers: real-time auction bidding routes the click, so `url` may not be where it
// lands.
export const unwrapNarrativ: UrlUnwrapper = createUnwrapper({
  hosts: [...redirectHosts, ...linkHosts],
  unwrap: (url) => {
    if (isAnyOf(url.pathname, linkPaths)) {
      return extractLinkTarget(url)
    }

    if (!redirectPathRegex.test(url.pathname)) {
      return
    }

    return extractTarget(url)
  },
})
