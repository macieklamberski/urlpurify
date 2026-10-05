import { createParamExtractor } from '../utils.js'

// SoundCloud exit link (exit.sc/?url=<target>).
export const unwrapSoundcloud = createParamExtractor({
  hosts: 'exit.sc',
  path: '/',
  params: ['url'],
})
