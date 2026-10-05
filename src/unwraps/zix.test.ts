import { describe, expect, it } from 'bun:test'
import { unwrapZix } from './zix.js'

describe('unwrapZix', () => {
  it('should extract target from u param', () => {
    const url = new URL(
      'https://link.zixcentral.com/u/08573078/uLbJvu8j6RG0fTcth3soMg?u=https%3A%2F%2Fwww.example.com%2F279937978',
    )

    expect(unwrapZix(url)).toBe('https://www.example.com/279937978')
  })

  it('should return undefined when u param is missing', () => {
    const url = new URL('https://link.zixcentral.com/u/0009ef6c/fDESoFp17BGszJlLKHgf9A')

    expect(unwrapZix(url)).toBeUndefined()
  })

  it('should return undefined for another path', () => {
    const url = new URL('https://link.zixcentral.com/filter?u=https%3A%2F%2Fwww.example.com%2F')

    expect(unwrapZix(url)).toBeUndefined()
  })

  it('should return undefined for another host', () => {
    const url = new URL(
      'https://link.example.com/u/08573078/uLbJvu8j6RG0fTcth3soMg?u=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapZix(url)).toBeUndefined()
  })
})
