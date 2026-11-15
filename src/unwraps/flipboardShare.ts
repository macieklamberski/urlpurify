import { createParamExtractor } from '../utils.js'

// Flipboard share (share.flipboard.com/bookmarklet/popout?v=2&url=<target>&title=<title>, also on
// flipboard.com and www.flipboard.com). Opt-in: unwrapping returns the shared page, not the form
// that flips it into a magazine.
export const unwrapFlipboardShare = createParamExtractor({
  hosts: ['share.flipboard.com', 'flipboard.com', 'www.flipboard.com'],
  path: '/bookmarklet/popout',
  params: ['url'],
})
