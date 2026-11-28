import { createQueryUnwrapper } from '../utils.js'

// YouTube external redirect (www.youtube.com/redirect?q=<target>).
export const unwrapYoutube = createQueryUnwrapper({
  hosts: ['youtube.com', 'www.youtube.com'],
  path: '/redirect',
  params: ['q'],
})
