import { createQueryUnwrapper } from '../utils.js'

// Centrum.cz and Atlas.cz webmail dereferrer (redir.netcentrum.cz/?noaudit&url=<target>).
export const unwrapNetcentrum = createQueryUnwrapper({
  hosts: 'redir.netcentrum.cz',
  path: '/',
  params: ['url'],
})
