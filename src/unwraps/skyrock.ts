import { createParamExtractor } from '../utils.js'

// Skyrock blog outbound link redirect (www.skyrock.com/r?url=<target>), also on befr.skyrock.com.
export const unwrapSkyrock = createParamExtractor({
  hosts: ['www.skyrock.com', 'befr.skyrock.com'],
  path: '/r',
  params: ['url'],
})
