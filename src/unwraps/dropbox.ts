import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

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
export const unwrapDropbox = createUnwrapper({
  hosts: ['www.dropbox.com', 'paper.dropbox.com'],
  unwrap: (url) => {
    return unwrapReferrerCleansing(url) ?? unwrapPaperLink(url) ?? unwrapLegacyPaperLink(url)
  },
})
