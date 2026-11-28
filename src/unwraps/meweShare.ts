import { createQueryUnwrapper } from '../utils.js'

// MeWe share (mewe.com/share?link=<target>).
// Opt-in: the link opens MeWe's post composer with the page attached, it never redirects to it.
export const unwrapMeweShare = createQueryUnwrapper({
  hosts: ['mewe.com', 'www.mewe.com'],
  path: '/share',
  params: ['link'],
  ignoreLinkFragment: true,
})
