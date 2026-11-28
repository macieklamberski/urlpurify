import { createQueryUnwrapper } from '../utils.js'

// Hashnode outbound redirect (hashnode.com/util/redirect?url=<target>).
export const unwrapHashnode = createQueryUnwrapper({
  hosts: ['hashnode.com', 'www.hashnode.com'],
  path: '/util/redirect',
  params: ['url'],
})
