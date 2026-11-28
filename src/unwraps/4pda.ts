import { createQueryUnwrapper } from '../utils.js'

// 4PDA forum outbound link redirect (4pda.ru/pages/go/?u=<target>, also 4pda.to/pages/go?u=).
export const unwrap4pda = createQueryUnwrapper({
  hosts: ['4pda.ru', 'www.4pda.ru', '4pda.to', 'www.4pda.to'],
  path: ['/pages/go', '/pages/go/'],
  params: ['u'],
})
