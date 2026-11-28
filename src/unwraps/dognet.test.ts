import { describe, expect, it } from 'bun:test'
import { unwrapDognet } from './dognet.js'

describe('unwrapDognet', () => {
  it('should extract a plain target from url param', () => {
    const value = new URL(
      'https://go.dognet.com/?chid=Kg5YxNHo&url=https://www.example.com/autori/126444-tomas-galierik.html',
    )
    const expected = 'https://www.example.com/autori/126444-tomas-galierik.html'

    expect(unwrapDognet(value)).toBe(expected)
  })

  it('should extract a percent-encoded target from url param', () => {
    const value = new URL(
      'https://go.dognet.com/?chid=bZ3spcll&d1=otthon&url=https%3A%2F%2Fwww.example.com%2Fipl-szortelenito-gep',
    )
    const expected = 'https://www.example.com/ipl-szortelenito-gep'

    expect(unwrapDognet(value)).toBe(expected)
  })

  it('should return undefined when url param is missing', () => {
    const value = new URL('https://go.dognet.com/?chid=Kg5YxNHo')

    expect(unwrapDognet(value)).toBeUndefined()
  })

  it('should return undefined for other paths on the Dognet host', () => {
    const value = new URL(
      'https://go.dognet.com/banner?chid=Kg5YxNHo&url=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapDognet(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/?chid=Kg5YxNHo&url=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapDognet(value)).toBeUndefined()
  })
})
