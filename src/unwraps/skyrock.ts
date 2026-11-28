import { createQueryUnwrapper } from '../utils.js'

// Skyrock blog outbound link redirect (www.skyrock.com/r?url=<target>), also on befr.skyrock.com.
export const unwrapSkyrock = createQueryUnwrapper({
  hosts: ['www.skyrock.com', 'skyrock.com', 'befr.skyrock.com'],
  path: '/r',
  params: ['url'],
})
