import { createQueryUnwrapper } from '../utils.js'

const goPathRegex = /^\/pages\/go\/?$/i

// 4PDA forum outbound link redirect (4pda.ru/pages/go/?u=<target>, also 4pda.to/pages/go?u=).
export const unwrap4pda = createQueryUnwrapper({
  hosts: ['4pda.ru', 'www.4pda.ru', '4pda.to', 'www.4pda.to'],
  path: goPathRegex,
  params: ['u'],
})
