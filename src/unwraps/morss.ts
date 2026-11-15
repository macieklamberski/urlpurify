import { isAnyOf, isHostOf } from 'trousse'
import { getPathTarget } from '../pathTarget.js'
import type { UrlUnwrapper } from '../types.js'

// morss reads one option segment, so a second `:` segment is part of the target and 404s.
const optionsRegex = /^\/:(?<options>[^/]*)\//
const targetPrefixRegex = /^\/(?::[^/]*\/)?(?!:)/

const hosts = ['morss.it', 'www.morss.it']

// Files morss serves at its root, such as the stylesheet its feeds link as `/sheet.xsl`.
const ownPaths = [
  '/favicon.ico',
  '/index.html',
  '/logo.svg',
  '/main.js',
  '/picker.js',
  '/sheet.xsl',
]

// morss full-text feed proxy ([www.]morss.it/[:<options>/]<feed>, the feed raw, with or without
// its scheme). Opt-in: the link returns the feed with full articles, not the feed itself.
export const unwrapMorss: UrlUnwrapper = (url) => {
  if (!isHostOf(url, hosts) || isAnyOf(url.pathname, ownPaths)) {
    return
  }

  const options = url.pathname.match(optionsRegex)?.groups?.options ?? ''

  // The `items` option builds a feed out of an html page, so the target is a page, not a feed.
  if (options.split(':').some((option) => isAnyOf(option.split('=')[0], 'items'))) {
    return
  }

  // morss fetches a target without a scheme over http.
  return getPathTarget(url, targetPrefixRegex, 'http:')
}
