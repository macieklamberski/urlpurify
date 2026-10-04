import { createParamExtractor } from '../utils.js'

// Dzen away redirect (dzen.ru/away?to=<target>), on dzen.ru and every subdomain.
export const unwrapDzen = createParamExtractor({
  domains: 'dzen.ru',
  path: '/away',
  params: ['to'],
})
