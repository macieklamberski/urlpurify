import { createParamExtractor } from '../utils.js'

// Centrum.cz and Atlas.cz webmail dereferrer (redir.netcentrum.cz/?noaudit&url=<target>).
export const unwrapNetcentrum = createParamExtractor({
  hosts: 'redir.netcentrum.cz',
  path: '/',
  params: ['url'],
})
