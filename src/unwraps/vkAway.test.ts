import { describe, expect, it } from 'bun:test'
import { unwrapVkAway } from './vkAway.js'

describe('unwrapVkAway', () => {
  it('should extract target from to param', () => {
    const url = new URL('https://vk.com/away.php?to=https%3A%2F%2Fexample.com%2Fpage&utf=1')

    expect(unwrapVkAway(url)).toBe('https://example.com/page')
  })

  it('should return undefined when to param is missing', () => {
    const url = new URL('https://vk.com/away.php?utf=1')

    expect(unwrapVkAway(url)).toBeUndefined()
  })

  it('should return undefined for non-away VK paths', () => {
    const url = new URL('https://vk.com/profile?to=https%3A%2F%2Fexample.com')

    expect(unwrapVkAway(url)).toBeUndefined()
  })

  it('should return undefined for non-VK hosts', () => {
    const url = new URL('https://example.com/away.php?to=https%3A%2F%2Fother.com')

    expect(unwrapVkAway(url)).toBeUndefined()
  })
})
