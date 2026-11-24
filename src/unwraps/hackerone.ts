import { createQueryUnwrapper } from '../utils.js'

// HackerOne outbound link redirect on reports (hackerone.com/redirect?signature=<sig>&url=<target>).
export const unwrapHackerone = createQueryUnwrapper({
  hosts: 'hackerone.com',
  path: '/redirect',
  params: ['url'],
})
