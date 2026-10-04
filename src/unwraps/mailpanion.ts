import { createParamExtractor } from '../utils.js'

// Mailpanion email click tracker (mailpanion.com/?destination=<target>).
export const unwrapMailpanion = createParamExtractor({
  hosts: 'mailpanion.com',
  path: '/',
  params: ['destination'],
})
