import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = ['dropbox.com', 'www.dropbox.com']

const extractReferrerCleansing = createQueryUnwrapper({
  hosts,
  path: '/referrer_cleansing_redirect',
  params: ['url'],
})

const extractPaperLink = createQueryUnwrapper({
  hosts,
  path: '/paper/ep/redirect/external-link',
  params: ['url'],
})

const extractLegacyPaperLink = createQueryUnwrapper({
  hosts: 'paper.dropbox.com',
  path: '/ep/redirect/external-link',
  params: ['url'],
})

// Dropbox outbound link redirect (www.dropbox.com/referrer_cleansing_redirect?url=<target>) and
// the Paper external link (www.dropbox.com/paper/ep/redirect/external-link?url=<target>, also
// paper.dropbox.com/ep/redirect/external-link).
export const unwrapDropbox = createUnwrapper({
  hosts: [...hosts, 'paper.dropbox.com'],
  unwrap: (url) => {
    return extractReferrerCleansing(url) ?? extractPaperLink(url) ?? extractLegacyPaperLink(url)
  },
})
