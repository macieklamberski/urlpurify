import { createParamExtractor } from '../utils.js'

// Dzen away redirect (dzen.ru/away?to=<target>).
export const unwrapDzen = createParamExtractor({
  hosts: 'dzen.ru',
  path: '/away',
  params: ['to'],
})
