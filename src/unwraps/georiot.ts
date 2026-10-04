import { createParamExtractor } from '../utils.js'

// GeoRiot / Geni.us geo-targeted affiliate redirect
// (target.georiot.com/Proxy.ashx?GR_URL=<target>), on georiot.com and every subdomain.
export const unwrapGeoriot = createParamExtractor({
  domains: 'georiot.com',
  path: '/Proxy.ashx',
  params: ['GR_URL'],
})
