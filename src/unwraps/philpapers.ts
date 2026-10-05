import { createParamExtractor } from '../utils.js'

// PhilPapers outbound link to a work's source (philpapers.org/go.pl?id=<id>&proxyId=&u=<target>).
export const unwrapPhilpapers = createParamExtractor({
  hosts: 'philpapers.org',
  path: '/go.pl',
  params: ['u'],
})
