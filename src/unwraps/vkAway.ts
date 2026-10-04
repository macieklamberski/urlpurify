import { createParamExtractor } from '../utils.js'

// VK away redirect (vk.com/away.php?to=<target>), also on vk.ru and the m. and new. hosts.
export const unwrapVkAway = createParamExtractor({
  hosts: ['vk.com', 'vk.ru', 'm.vk.com', 'new.vk.com', 'm.vk.ru'],
  path: '/away.php',
  params: ['to'],
})
