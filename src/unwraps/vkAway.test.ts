import { describe, expect, it } from 'bun:test'
import { unwrapVkAway } from './vkAway.js'

describe('unwrapVkAway', () => {
  it('should extract target from to param', () => {
    const value = new URL('https://vk.com/away.php?to=https%3A%2F%2Fexample.com%2Fpage&utf=1')
    const expected = 'https://example.com/page'

    expect(unwrapVkAway(value)).toBe(expected)
  })

  it('should return undefined when to param is missing', () => {
    const value = new URL('https://vk.com/away.php?utf=1')

    expect(unwrapVkAway(value)).toBeUndefined()
  })

  it('should return undefined for non-away VK paths', () => {
    const value = new URL('https://vk.com/profile?to=https%3A%2F%2Fexample.com')

    expect(unwrapVkAway(value)).toBeUndefined()
  })

  it('should return undefined for non-VK hosts', () => {
    const value = new URL('https://example.com/away.php?to=https%3A%2F%2Fother.com')

    expect(unwrapVkAway(value)).toBeUndefined()
  })
})
