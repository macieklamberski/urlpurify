import type { UrlUnwrapper } from '../types.js'
import { createQueryUnwrapper } from '../utils.js'

const unwrapReferrerCleansing = createQueryUnwrapper({
  hosts: 'www.dropbox.com',
  path: '/referrer_cleansing_redirect',
  params: ['url'],
})

const unwrapPaperLink = createQueryUnwrapper({
  hosts: 'www.dropbox.com',
  path: '/paper/ep/redirect/external-link',
  params: ['url'],
})

const unwrapLegacyPaperLink = createQueryUnwrapper({
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
