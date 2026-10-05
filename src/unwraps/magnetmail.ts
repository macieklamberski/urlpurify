import { createParamExtractor } from '../utils.js'

// MagnetMail email click tracker (www.mmsend<n>.com/link.cfm?r=<id>&sid=<id>&m=<id>&u=<account>
// &s=<target>). Opt-in: an email click tracker, like the others in its group.
export const unwrapMagnetmail = createParamExtractor({
  hosts: /^www\.mmsend\d+\.com$/,
  path: '/link.cfm',
  params: ['s'],
})
