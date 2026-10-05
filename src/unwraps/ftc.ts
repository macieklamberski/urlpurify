import { createParamExtractor } from '../utils.js'

// FTC leaving-site page (www.ftc.gov/now-leaving?external_url=<target>&back_url=<page>), also on
// consumer.ftc.gov and consumidor.ftc.gov. The page names the target and links on to it.
export const unwrapFtc = createParamExtractor({
  hosts: ['www.ftc.gov', 'consumer.ftc.gov', 'consumidor.ftc.gov'],
  path: '/now-leaving',
  params: ['external_url'],
})
