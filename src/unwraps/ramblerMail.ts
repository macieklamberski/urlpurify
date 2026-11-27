import { createQueryUnwrapper } from '../utils.js'

// Rambler Mail link redirect (mail.rambler.ru/m/redirect?url=<target>&hash=<signature>).
export const unwrapRamblerMail = createQueryUnwrapper({
  hosts: 'mail.rambler.ru',
  path: '/m/redirect',
  params: ['url'],
})
