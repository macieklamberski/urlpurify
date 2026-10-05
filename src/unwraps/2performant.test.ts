import { describe, expect, it } from 'bun:test'
import { unwrap2performant } from './2performant.js'

describe('unwrap2performant', () => {
  it('should extract a twice-encoded target from a quicklink', () => {
    const url = new URL(
      'https://event.2performant.com/events/click?ad_type=quicklink&aff_code=6dc26cf73&unique=442160f12&redirect_to=https%253A//www.example.com/perie-lemn-fag%253Fp%253D2',
    )

    expect(unwrap2performant(url)).toBe('https://www.example.com/perie-lemn-fag?p=2')
  })

  it('should extract a once-encoded target from a quicklink', () => {
    const url = new URL(
      'http://event.2parale.ro/events/click?ad_type=quicklink&aff_code=418ac0630&unique=184f69294&redirect_to=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrap2performant(url)).toBe('http://www.example.com/')
  })

  it('should return undefined when redirect_to param is missing', () => {
    const url = new URL(
      'https://event.2performant.com/events/click?ad_type=quicklink&aff_code=6dc26cf73&unique=442160f12',
    )

    expect(unwrap2performant(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the tracker host', () => {
    const url = new URL(
      'https://event.2performant.com/events/impression?redirect_to=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrap2performant(url)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const url = new URL('https://example.com/events/click?redirect_to=https%3A%2F%2Fexample.org%2F')

    expect(unwrap2performant(url)).toBeUndefined()
  })
})
