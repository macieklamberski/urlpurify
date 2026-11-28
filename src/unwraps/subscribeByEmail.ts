import { createPathUnwrapper } from '../pathTarget.js'

// The feed follows the host, so the first segment has to look like a host, or a scheme some
// publishers leave on the feed. The site's own pages, such as /help/ and /favicon.ico, do not.
const feedPrefixRegex = /^\/(?=(?:https?:\/*)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?::\d+)?\/)/i

// Subscribe by Email subscribe button (subscribebyemail.com/<feed>), where the feed drops its
// scheme. The page reads the feed as https.
// Opt-in: unwrapping returns the feed, not the reader's or app's page that adds or plays it.
export const unwrapSubscribeByEmail = createPathUnwrapper({
  hosts: ['subscribebyemail.com', 'www.subscribebyemail.com'],
  prefix: feedPrefixRegex,
})
