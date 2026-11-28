import { createQueryUnwrapper } from '../utils.js'

// MagnetMail email click tracker ([www.]mmsend<n>.com/link.cfm?r=<id>&sid=<id>&m=<id>&u=<account>
// &s=<target>).
// Opt-in: unwrapping removes the sender's click count.
export const unwrapMagnetmail = createQueryUnwrapper({
  hosts: /^(?:www\.)?mmsend\d+\.com$/,
  path: '/link.cfm',
  params: ['s'],
})
