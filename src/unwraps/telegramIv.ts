import { createParamExtractor } from '../utils.js'

// Telegram Instant View (t.me/iv?url=<target>&rhash=<hash>).
// Not included in defaultUnwrappers: `t.me/iv` opens the URL inside
// Telegram's Instant View reader (a reformatted, lightweight rendering), not
// a redirect to the source. Opt in by passing a custom unwrappers array.
export const unwrapTelegramIv = createParamExtractor({
  hosts: 't.me',
  path: '/iv',
  params: ['url'],
})
