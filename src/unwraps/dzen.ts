import { createQueryUnwrapper } from '../utils.js'

// Dzen away redirect (dzen.ru/away?to=<target>).
export const unwrapDzen = createQueryUnwrapper({
  hosts: ['dzen.ru', 'www.dzen.ru'],
  path: '/away',
  params: ['to'],
})
