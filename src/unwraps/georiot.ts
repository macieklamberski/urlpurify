import { createParamExtractor } from '../utils.js'

// GeoRiot / Geni.us geo-targeted affiliate redirect
// (target.georiot.com/Proxy.ashx?GR_URL=<target>).
export const unwrapGeoriot = createParamExtractor({
  hosts: 'target.georiot.com',
  path: '/Proxy.ashx',
  params: ['GR_URL'],
})
