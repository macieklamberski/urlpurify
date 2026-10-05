import { createParamExtractor } from '../utils.js'

// GeoRiot / Geni.us geo-targeted affiliate redirect
// (target.georiot.com/Proxy.ashx?GR_URL=<target>, also on buy.geni.us and the custom domains
// local.kit.co and s.majornelson.com).
export const unwrapGeoriot = createParamExtractor({
  hosts: ['target.georiot.com', 'buy.geni.us', 'local.kit.co', 's.majornelson.com'],
  path: '/Proxy.ashx',
  params: ['GR_URL'],
})
