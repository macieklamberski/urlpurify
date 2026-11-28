import { createQueryUnwrapper } from '../utils.js'

// Telegram Instant View (t.me/iv?url=<target>&rhash=<hash>).
// Opt-in: unwrapping returns the live page, not the copy. Opt in by passing a custom unwrappers
// array.
export const unwrapTelegramIv = createQueryUnwrapper({
  hosts: ['t.me', 'www.t.me'],
  path: '/iv',
  params: ['url'],
})
