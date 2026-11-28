import { createQueryUnwrapper } from '../utils.js'

// SoundCloud exit link (exit.sc/?url=<target>).
export const unwrapSoundcloud = createQueryUnwrapper({
  hosts: ['exit.sc', 'www.exit.sc'],
  path: '/',
  params: ['url'],
})
