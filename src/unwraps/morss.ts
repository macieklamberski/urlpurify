import { isAnyOf } from 'trousse'
import { readPathTarget } from '../pathTarget.js'
import { createUnwrapper } from '../utils.js'

const optionsRegex = /^\/:(?<options>[^/]*)\//
// morss reads one option segment, so a second `:` segment is part of the target and 404s.
const targetPrefixRegex = /^\/(?::[^/]*\/)?(?!:)/

// morss full-text feed proxy ([www.]morss.it/[:<options>/]<feed>, the feed raw, with or without its
// scheme).
// Opt-in: the link returns the feed with full articles, not the feed itself.
export const unwrapMorss = createUnwrapper({
  hosts: ['morss.it', 'www.morss.it'],
  unwrap: (url) => {
    const options = optionsRegex.exec(url.pathname)?.groups?.options ?? ''

    // The `items` option builds a feed out of an html page, so the target is a page, not a feed.
    if (options.split(':').some((option) => isAnyOf(option.split('=')[0], 'items'))) {
      return
    }

    // morss fetches a target without a scheme over http.
    return readPathTarget(url, targetPrefixRegex, 'http')
  },
})
