import { describe, expect, it } from 'bun:test'
import { unwrapNetaffiliation } from './netaffiliation.js'

describe('unwrapNetaffiliation', () => {
  it('should extract target from redir param on the tracker host', () => {
    const url = new URL(
      'http://action.metaffiliation.com/trk.php?mclic=P4847B56A1A9171&redir=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapNetaffiliation(url)).toBe('http://www.example.com/')
  })

  it('should return undefined when redir param is missing on the tracker host', () => {
    const url = new URL('http://action.metaffiliation.com/trk.php?mclic=P4847B56A1A9171')

    expect(unwrapNetaffiliation(url)).toBeUndefined()
  })

  it('should return undefined for other paths on the tracker host', () => {
    const url = new URL(
      'http://action.metaffiliation.com/redir.php?mclic=P4847B56A1A9171&redir=http%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapNetaffiliation(url)).toBeUndefined()
  })

  it('should extract a plain target from a merchant tracking host', () => {
    const url = new URL(
      'https://irh.oscaro.com/?P5139555780512191&redir=https://www.example.com/kit-dembrayage-audi-a4',
    )

    expect(unwrapNetaffiliation(url)).toBe('https://www.example.com/kit-dembrayage-audi-a4')
  })

  it('should keep a plus in an unencoded target on a merchant tracking host', () => {
    const url = new URL(
      'https://lzm.boulanger.com/?P513B9956B0382111&redir=https://www.example.com/resultats?tr=S26+FE',
    )

    expect(unwrapNetaffiliation(url)).toBe('https://www.example.com/resultats?tr=S26+FE')
  })

  it('should read the first copy of redir on a merchant tracking host', () => {
    const url = new URL(
      'https://lzm.boulanger.com/?P513B9956B0382111&redir=https://www.example.com/a+b&redir=https://www.example.com/c',
    )

    expect(unwrapNetaffiliation(url)).toBe('https://www.example.com/a+b')
  })

  it('should extract a percent-encoded target from a merchant tracking host', () => {
    const url = new URL(
      'https://fsx.i-run.fr/?P4572B563A3F191&redir=https%3A%2F%2Fwww.example.com%2Fcardio-gps%2Fpolar-vantage-m2.html',
    )

    expect(unwrapNetaffiliation(url)).toBe(
      'https://www.example.com/cardio-gps/polar-vantage-m2.html',
    )
  })

  it('should return undefined when the merchant query does not open with the click id', () => {
    const url = new URL('https://www.example.com/?page=2&redir=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapNetaffiliation(url)).toBeUndefined()
  })

  it('should return undefined when the bare key is too short for a click id', () => {
    const url = new URL('https://www.example.com/?P123&redir=https%3A%2F%2Fwww.example.org%2F')

    expect(unwrapNetaffiliation(url)).toBeUndefined()
  })

  it('should return undefined for a merchant click id on another path', () => {
    const url = new URL(
      'https://irh.oscaro.com/search?P5139555780512191&redir=https%3A%2F%2Fwww.example.com%2F',
    )

    expect(unwrapNetaffiliation(url)).toBeUndefined()
  })

  it('should return undefined for a non-http target on a merchant tracking host', () => {
    const url = new URL('https://irh.oscaro.com/?P5139555780512191&redir=javascript:alert(1)')

    expect(unwrapNetaffiliation(url)).toBeUndefined()
  })
})
