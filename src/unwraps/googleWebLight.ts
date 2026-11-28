import { createQueryUnwrapper, createUnwrapper } from '../utils.js'

const hosts = ['googleweblight.com', 'www.googleweblight.com']

const extractLiteUrl = createQueryUnwrapper({
  hosts,
  path: '/',
  params: ['lite_url'],
})

const extractPageUrl = createQueryUnwrapper({
  hosts,
  path: '/i',
  params: ['u'],
})

// Google Web Light page proxy for slow connections (googleweblight.com/?lite_url=<target>, also
// /i?u=<target>).
// Opt-in: unwrapping returns the full page, not the lightened copy served for slow connections.
export const unwrapGoogleWebLight = createUnwrapper({
  hosts,
  unwrap: (url) => {
    return extractLiteUrl(url) ?? extractPageUrl(url)
  },
})
