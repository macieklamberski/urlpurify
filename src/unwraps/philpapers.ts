import { createQueryUnwrapper } from '../utils.js'

// PhilPapers outbound link to a work's source (philpapers.org/go.pl?id=<id>&proxyId=&u=<target>).
export const unwrapPhilpapers = createQueryUnwrapper({
  hosts: 'philpapers.org',
  path: '/go.pl',
  params: ['u'],
})
