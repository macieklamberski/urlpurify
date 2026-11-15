import { createParamExtractor } from '../utils.js'

// BlinkList bookmark button (www.blinklist.com/index.php?Action=Blink/addblink.php&Url=<page>,
// also on the bare host). Opt-in: unwrapping returns the bookmarked page, not the form.
export const unwrapBlinkList = createParamExtractor({
  hosts: ['www.blinklist.com', 'blinklist.com'],
  path: '/index.php',
  params: ['Url'],
})
