import { createQueryUnwrapper } from '../utils.js'

// Flipboard outbound redirect (flipboard.com/redirect?url=<target>).
export const unwrapFlipboard = createQueryUnwrapper({
  hosts: ['flipboard.com', 'www.flipboard.com'],
  path: '/redirect',
  params: ['url'],
})
