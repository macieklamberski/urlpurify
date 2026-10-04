import { createParamExtractor } from '../utils.js'

// VK away redirect (vk.com/away.php?to=<target>), also on vk.ru, with every subdomain.
export const unwrapVkAway = createParamExtractor({
  domains: ['vk.com', 'vk.ru'],
  path: '/away.php',
  params: ['to'],
})
