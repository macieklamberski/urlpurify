import { createQueryUnwrapper } from '../utils.js'

// W3C Feed Validation Service (validator.w3.org/feed/check.cgi?url=<feed>).
// Opt-in: unwrapping returns the feed the tool was given, not the tool's view of it.
export const unwrapW3cFeedValidator = createQueryUnwrapper({
  hosts: 'validator.w3.org',
  path: '/feed/check.cgi',
  params: ['url'],
  ignoreLinkFragment: true,
})
