import { createParamExtractor } from '../utils.js'

// MeWe share (mewe.com/share?link=<target>). Opt-in in the share intent group: the link opens
// MeWe's post composer with the page attached, it never redirects to it.
export const unwrapMeweShare = createParamExtractor({
  hosts: 'mewe.com',
  path: '/share',
  params: ['link'],
  ignoreLinkFragment: true,
})
