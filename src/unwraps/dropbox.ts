import type { UrlUnwrapper } from '../types.js'
import { createParamExtractor } from '../utils.js'

const unwrapReferrerCleansing = createParamExtractor({
  hosts: 'www.dropbox.com',
  path: '/referrer_cleansing_redirect',
  params: ['url'],
})

const unwrapPaperLink = createParamExtractor({
  hosts: 'www.dropbox.com',
  path: '/paper/ep/redirect/external-link',
  params: ['url'],
})

const unwrapLegacyPaperLink = createParamExtractor({
  hosts: 'paper.dropbox.com',
  path: '/ep/redirect/external-link',
  params: ['url'],
})

// Dropbox outbound link redirect (www.dropbox.com/referrer_cleansing_redirect?url=<target>) and
// the Paper external link (www.dropbox.com/paper/ep/redirect/external-link?url=<target>, also
// paper.dropbox.com/ep/redirect/external-link).
export const unwrapDropbox: UrlUnwrapper = (url) => {
  return unwrapReferrerCleansing(url) ?? unwrapPaperLink(url) ?? unwrapLegacyPaperLink(url)
}
