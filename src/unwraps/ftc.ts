import { createParamExtractor } from '../utils.js'

// FTC leaving-site page (www.ftc.gov/now-leaving?external_url=<target>&back_url=<page>), also on
// consumer.ftc.gov and consumidor.ftc.gov. The page named the target and linked on to it until
// 2026-09, and now answers 302 to the site's home page.
export const unwrapFtc = createParamExtractor({
  hosts: ['www.ftc.gov', 'consumer.ftc.gov', 'consumidor.ftc.gov'],
  path: '/now-leaving',
  params: ['external_url'],
})
