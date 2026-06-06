import { createParamExtractor } from '../utils.js'

// VK away redirect (vk.com/away.php?to=<target>).
export const unwrapVkAway = createParamExtractor({
  hosts: 'vk.com',
  path: '/away.php',
  params: ['to'],
})
