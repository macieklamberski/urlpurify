import { createParamExtractor } from '../utils.js'

// SoundCloud exit link (exit.sc/?url=<target>), on every subdomain.
export const unwrapSoundcloud = createParamExtractor({
  domains: 'exit.sc',
  path: '/',
  params: ['url'],
})
