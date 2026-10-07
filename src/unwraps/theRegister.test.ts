import { describe, expect, it } from 'bun:test'
import { unwrapTheRegister } from './theRegister.js'

describe('unwrapTheRegister', () => {
  it('should add the https scheme to a target stored without one', () => {
    const url = new URL(
      'https://go.theregister.com/feed/www.theregister.com/2024/03/08/microsoft_confirms_russian_spies_stole/',
    )

    expect(unwrapTheRegister(url)).toBe(
      'https://www.theregister.com/2024/03/08/microsoft_confirms_russian_spies_stole/',
    )
  })

  it('should keep the scheme of a target stored with one', () => {
    const url = new URL(
      'http://go.theregister.com/feed/http://www.theregister.co.uk/2006/02/14/uma_voip_analysis/',
    )

    expect(unwrapTheRegister(url)).toBe(
      'http://www.theregister.co.uk/2006/02/14/uma_voip_analysis/',
    )
  })

  it('should extract a target on a former sister site', () => {
    const url = new URL(
      'https://go.theregister.com/feed/www.reghardware.co.uk/2009/12/17/lockface_usb/',
    )

    expect(unwrapTheRegister(url)).toBe('https://www.reghardware.co.uk/2009/12/17/lockface_usb/')
  })

  it('should return undefined for a target on another site', () => {
    const url = new URL('https://go.theregister.com/feed/www.example.com/2024/03/08/article/')

    expect(unwrapTheRegister(url)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with The Register', () => {
    const url = new URL(
      'https://go.theregister.com/feed/www.theregister.com.example.com/2024/03/08/article/',
    )

    expect(unwrapTheRegister(url)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const url = new URL('https://go.theregister.com/www.theregister.com/2024/03/08/article/')

    expect(unwrapTheRegister(url)).toBeUndefined()
  })

  it('should return undefined for the path on another host', () => {
    const url = new URL('https://example.com/feed/www.theregister.com/2024/03/08/article/')

    expect(unwrapTheRegister(url)).toBeUndefined()
  })

  it('should extract the target of the i/cfa counter path', () => {
    const url = new URL(
      'https://go.theregister.com/i/cfa/https://www.theregister.com/2023/07/26/openai_ai_classifier/',
    )

    expect(unwrapTheRegister(url)).toBe(
      'https://www.theregister.com/2023/07/26/openai_ai_classifier/',
    )
  })
})
