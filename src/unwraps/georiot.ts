import { createParamExtractor } from '../utils.js'

// GeoRiot / Geni.us geo-targeted affiliate redirect
// (target.georiot.com/Proxy.ashx?GR_URL=<target>, also on buy.geni.us).
export const unwrapGeoriot = createParamExtractor({
  hosts: ['target.georiot.com', 'buy.geni.us'],
  path: '/Proxy.ashx',
  params: ['GR_URL'],
})
