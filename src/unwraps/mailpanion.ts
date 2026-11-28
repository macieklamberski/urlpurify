import { createQueryUnwrapper } from '../utils.js'

// Mailpanion email click tracker (mailpanion.com/?destination=<target>).
export const unwrapMailpanion = createQueryUnwrapper({
  hosts: ['mailpanion.com', 'www.mailpanion.com'],
  path: '/',
  params: ['destination'],
})
