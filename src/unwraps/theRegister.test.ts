import { describe, expect, it } from 'bun:test'
import { unwrapTheRegister } from './theRegister.js'

describe('unwrapTheRegister', () => {
  it('should extract a target stored without a scheme', () => {
    const value = new URL(
      'https://go.theregister.com/feed/www.theregister.com/2024/03/08/microsoft_confirms_russian_spies_stole/',
    )
    const expected = 'www.theregister.com/2024/03/08/microsoft_confirms_russian_spies_stole/'

    expect(unwrapTheRegister(value)).toBe(expected)
  })

  it('should keep the scheme of a target stored with one', () => {
    const value = new URL(
      'http://go.theregister.com/feed/http://www.theregister.co.uk/2006/02/14/uma_voip_analysis/',
    )
    const expected = 'http://www.theregister.co.uk/2006/02/14/uma_voip_analysis/'

    expect(unwrapTheRegister(value)).toBe(expected)
  })

  it('should extract a target on a former sister site', () => {
    const value = new URL(
      'https://go.theregister.com/feed/www.reghardware.co.uk/2009/12/17/lockface_usb/',
    )
    const expected = 'www.reghardware.co.uk/2009/12/17/lockface_usb/'

    expect(unwrapTheRegister(value)).toBe(expected)
  })

  it('should return undefined for a target on another site', () => {
    const value = new URL('https://go.theregister.com/feed/www.example.com/2024/03/08/article/')

    expect(unwrapTheRegister(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with The Register', () => {
    const value = new URL(
      'https://go.theregister.com/feed/www.theregister.com.example.com/2024/03/08/article/',
    )

    expect(unwrapTheRegister(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL('https://go.theregister.com/www.theregister.com/2024/03/08/article/')

    expect(unwrapTheRegister(value)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const value = new URL('https://example.com/feed/www.theregister.com/2024/03/08/article/')

    expect(unwrapTheRegister(value)).toBeUndefined()
  })

  it('should extract the target of the i/cfa counter path', () => {
    const value = new URL(
      'https://go.theregister.com/i/cfa/https://www.theregister.com/2023/07/26/openai_ai_classifier/',
    )
    const expected = 'https://www.theregister.com/2023/07/26/openai_ai_classifier/'

    expect(unwrapTheRegister(value)).toBe(expected)
  })

  it('should return undefined for another counter path on the host', () => {
    const value = new URL('https://go.theregister.com/i/x/www.theregister.com/2024/03/08/article/')

    expect(unwrapTheRegister(value)).toBeUndefined()
  })

  it('should keep a target without a scheme behind an http counter', () => {
    const value = new URL(
      'http://go.theregister.com/feed/www.theregister.com/2024/03/08/microsoft_confirms_russian_spies_stole/',
    )
    const expected = 'www.theregister.com/2024/03/08/microsoft_confirms_russian_spies_stole/'

    expect(unwrapTheRegister(value)).toBe(expected)
  })
})
