import { createQueryUnwrapper } from '../utils.js'

// MeWe share (mewe.com/share?link=<target>).
// Opt-in: unwrapping returns the shared page, not the form that shares it.
export const unwrapMeweShare = createQueryUnwrapper({
  hosts: ['mewe.com', 'www.mewe.com'],
  path: '/share',
  params: ['link'],
  ignoreLinkFragment: true,
})
