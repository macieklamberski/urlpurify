import { createParamExtractor } from '../utils.js'

// Ask.com search result click redirect (wzus.ask.com/r?...&u=<target>).
export const unwrapAsk = createParamExtractor({
  hosts: ['wzeu.ask.com', 'wzpo.ask.com', 'wzus.ask.com', 'wzus1.ask.com'],
  path: '/r',
  params: ['u'],
})
