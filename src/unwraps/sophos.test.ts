import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapSophos } from './sophos.js'

describe('unwrapSophos', () => {
  it('should decode a base64 u param', () => {
    const value = new URL(
      'https://eu-central-1.protection.sophos.com/?d=example.com&u=aHR0cDovL3d3dy5leGFtcGxlLmNvbS9Fbi9EYXRhL1ZpZXcvMzk3Mg==&i=NjA5NDA5OTI5NmUwM2YzNzEwODdhNzM3&t=MnQ4UUR5Q0lwa3pvL0pQWUozMXdJQlRKdExQWG01RkxXM1llVEUzakJ2az0=&h=b05e70cb6982454e9fe217d143786902',
    )
    const expected = 'http://www.example.com/En/Data/View/3972'

    expect(unwrapSophos(value)).toBe(expected)
  })

  it('should decode a base64url u param', () => {
    const value = new URL(
      'https://ca-central-1.protection.sophos.com/?d=example.com&u=aHR0cHM6Ly93d3cuZXhhbXBsZS5jb20vd2F0Y2g_dj1UdEZfZ0VrY1NCcw==&i=Njc1NzkzNmJiYTBhMjk3ZDYyMjk5MzBh&t=azVrN1ZmRXp2YllLM1dyNHMxNHY2M2d4SDRwR0FrUnRjZjNSbHdBcjJ4WT0=&h=ce7716503f8347878c75806524539a68',
    )
    const expected = 'https://www.example.com/watch?v=TtF_gEkcSBs'

    expect(unwrapSophos(value)).toBe(expected)
  })

  it('should decode a u param without padding', () => {
    const value = new URL(
      'https://us-west-2.protection.sophos.com/?d=example.com&u=aHR0cHM6Ly9leGFtcGxlLmNvbS9h&i=Njc1NzkzNmJiYTBhMjk3ZDYy',
    )
    const expected = 'https://example.com/a'

    expect(unwrapSophos(value)).toBe(expected)
  })

  it('should give https to a decoded target without a scheme', () => {
    const value =
      'https://us-east-2.protection.sophos.com/?d=example.com&u=d3d3LmV4YW1wbGUuY29t&i=NWZmODliYjViODNhNjYw'
    const expected = 'https://www.example.com/'

    expect(purifyUrl(value, { unwrappers: [unwrapSophos] })).toBe(expected)
  })

  it('should return undefined when the decoded value is not http', () => {
    const value = new URL(
      'https://us-east-2.protection.sophos.com/?d=example.com&u=bWFpbHRvOmluZm9AZXhhbXBsZS5jb20=',
    )

    expect(unwrapSophos(value)).toBeUndefined()
  })

  it('should return undefined when u param is missing', () => {
    const value = new URL('https://eu-west-1.protection.sophos.com/?d=example.com')

    expect(unwrapSophos(value)).toBeUndefined()
  })

  it('should return undefined when u param is empty', () => {
    const value = new URL('https://eu-west-1.protection.sophos.com/?d=example.com&u=')

    expect(unwrapSophos(value)).toBeUndefined()
  })

  it('should return undefined for another path on the host', () => {
    const value = new URL(
      'https://eu-west-1.protection.sophos.com/report?d=example.com&u=aHR0cHM6Ly9leGFtcGxlLmNvbS9h',
    )

    expect(unwrapSophos(value)).toBeUndefined()
  })

  it('should return undefined for other hosts', () => {
    const value = new URL('https://example.com/?u=aHR0cHM6Ly9leGFtcGxlLmNvbS9h')

    expect(unwrapSophos(value)).toBeUndefined()
  })

  it('should return undefined for a host outside the regional family', () => {
    const value = new URL('https://www.protection.sophos.com/?u=aHR0cHM6Ly9leGFtcGxlLmNvbS9h')

    expect(unwrapSophos(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends with the domain', () => {
    const value = new URL(
      'https://mail.eu-west-1.protection.sophos.com/?u=aHR0cHM6Ly9leGFtcGxlLmNvbS9h',
    )

    expect(unwrapSophos(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with the domain', () => {
    const value = new URL(
      'https://eu-west-1.protection.sophos.com.example.com/?u=aHR0cHM6Ly9leGFtcGxlLmNvbS9h',
    )

    expect(unwrapSophos(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://eu-west-1.protection.examplesophos.com/?u=aHR0cHM6Ly9leGFtcGxlLmNvbS9h',
    )

    expect(unwrapSophos(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://eu-central-1.protection.sophos.com/?d=example.com&u=aHR0cDovL3d3dy5leGFtcGxlLmNvbS9Fbi9EYXRhL1ZpZXcvMzk3MiN0b3A%3D&i=NjA5NDA5OTI5NmUwM2YzNzEwODdhNzM3&t=MnQ4UUR5Q0lwa3pvL0pQWUozMXdJQlRKdExQWG01RkxXM1llVEUzakJ2az0=&h=b05e70cb6982454e9fe217d143786902',
    )
    const expected = 'http://www.example.com/En/Data/View/3972#top'

    expect(unwrapSophos(value)).toBe(expected)
  })
})
