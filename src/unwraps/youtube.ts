import { createQueryUnwrapper } from '../utils.js'

// YouTube external redirect (www.youtube.com/redirect?q=<target>).
export const unwrapYoutube = createQueryUnwrapper({
  hosts: ['www.youtube.com', 'youtube.com'],
  path: '/redirect',
  params: ['q'],
})
