import { createQueryUnwrapper } from '../utils.js'

// W3C Feed Validation Service (validator.w3.org/feed/check.cgi?url=<feed>).
// Opt-in: the link opens the validator's report on the feed, it never redirects to it.
export const unwrapW3cFeedValidator = createQueryUnwrapper({
  hosts: 'validator.w3.org',
  path: '/feed/check.cgi',
  params: ['url'],
  ignoreLinkFragment: true,
})
