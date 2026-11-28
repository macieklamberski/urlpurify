import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapMandrill } from './mandrill.js'

describe('unwrapMandrill', () => {
  it('should give https to a target without a scheme', () => {
    const value =
      'https://mandrillapp.com/track/click/1/example.com?p=eyJwIjoie1widXJsXCI6XCJ3d3cuZXhhbXBsZS5jb20vcGFnZVwifSJ9'
    const expected = 'https://www.example.com/page'

    expect(purifyUrl(value, { unwrappers: [unwrapMandrill] })).toBe(expected)
  })

  it('should extract target from url param on click.php', () => {
    const value = new URL(
      'http://mandrillapp.com/track/click.php?u=3541274&id=acd0abe879a143b4a5ed32beba272b35&url=http%3A%2F%2Fexample.com%2Fsign_up%3Freferrer_id%3D3055614&url_id=8f1d5a3c',
    )
    const expected = 'http://example.com/sign_up?referrer_id=3055614'

    expect(unwrapMandrill(value)).toBe(expected)
  })

  it('should extract target from the p payload', () => {
    const value = new URL(
      'https://mandrillapp.com/track/click/30295795/example.com?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJodHRwczovL2V4YW1wbGUuY29tL1wiLFwiaWRcIjpcImNjNTgxZGNhMGJiMDRlZTBiYTNkOTkwYzg1OWJlMTE0XCIsXCJ1cmxfaWRzXCI6W1wiNWMzYTcyNjNkMDgzODdmNzMxOTE2NTRmNzI1ZTVjMGJjZDRlZjhjY1wiXX0ifQ',
    )
    const expected = 'https://example.com/'

    expect(unwrapMandrill(value)).toBe(expected)
  })

  it('should keep the wrapper for a non-http target in the p payload', () => {
    const value =
      'https://mandrillapp.com/track/click/30295795/example.com?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJqYXZhc2NyaXB0OmFsZXJ0KDEpXCIsXCJpZFwiOlwiY2M1ODFkY2EwYmIwNGVlMGJhM2Q5OTBjODU5YmUxMTRcIixcInVybF9pZHNcIjpbXCI1YzNhNzI2M2QwODM4N2Y3MzE5MTY1NGY3MjVlNWMwYmNkNGVmOGNjXCJdfSJ9'

    expect(purifyUrl(value, { unwrappers: [unwrapMandrill] })).toBe(value)
  })

  it('should return undefined for a p payload without an inner payload', () => {
    const value = new URL(
      'https://mandrillapp.com/track/click/30295795/example.com?p=eyJzIjoieCIsInYiOjF9',
    )

    expect(unwrapMandrill(value)).toBeUndefined()
  })

  it('should return undefined for a p payload that is not base64 JSON', () => {
    const value = new URL('https://mandrillapp.com/track/click/30295795/example.com?p=not-json')

    expect(unwrapMandrill(value)).toBeUndefined()
  })

  it('should return undefined when p param is missing', () => {
    const value = new URL('https://mandrillapp.com/track/click/30295795/example.com')

    expect(unwrapMandrill(value)).toBeUndefined()
  })

  it('should return undefined when url param is missing on click.php', () => {
    const value = new URL('http://mandrillapp.com/track/click.php?u=3541274&id=acd0abe879a1')

    expect(unwrapMandrill(value)).toBeUndefined()
  })

  it('should return undefined for click.php on another host', () => {
    const value = new URL(
      'https://example.com/track/click.php?u=3541274&id=acd0abe879a1&url=http%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapMandrill(value)).toBeUndefined()
  })

  it('should return undefined for the click path below another segment', () => {
    const value = new URL(
      'https://mandrillapp.com/x/track/click/30295795/example.com?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJodHRwczovL2V4YW1wbGUuY29tL1wiLFwiaWRcIjpcImNjNTgxZGNhMGJiMDRlZTBiYTNkOTkwYzg1OWJlMTE0XCIsXCJ1cmxfaWRzXCI6W1wiNWMzYTcyNjNkMDgzODdmNzMxOTE2NTRmNzI1ZTVjMGJjZDRlZjhjY1wiXX0ifQ',
    )

    expect(unwrapMandrill(value)).toBeUndefined()
  })

  it('should return undefined for the click path without the target host', () => {
    const value = new URL(
      'https://mandrillapp.com/track/click/30295795?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJodHRwczovL2V4YW1wbGUuY29tL1wiLFwiaWRcIjpcImNjNTgxZGNhMGJiMDRlZTBiYTNkOTkwYzg1OWJlMTE0XCIsXCJ1cmxfaWRzXCI6W1wiNWMzYTcyNjNkMDgzODdmNzMxOTE2NTRmNzI1ZTVjMGJjZDRlZjhjY1wiXX0ifQ',
    )

    expect(unwrapMandrill(value)).toBeUndefined()
  })

  it('should return undefined for the click path with a segment after the target host', () => {
    const value = new URL(
      'https://mandrillapp.com/track/click/30295795/example.com/x?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJodHRwczovL2V4YW1wbGUuY29tL1wiLFwiaWRcIjpcImNjNTgxZGNhMGJiMDRlZTBiYTNkOTkwYzg1OWJlMTE0XCIsXCJ1cmxfaWRzXCI6W1wiNWMzYTcyNjNkMDgzODdmNzMxOTE2NTRmNzI1ZTVjMGJjZDRlZjhjY1wiXX0ifQ',
    )

    expect(unwrapMandrill(value)).toBeUndefined()
  })

  it('should return undefined for the click path on another host', () => {
    const value = new URL(
      'https://example.com/track/click/30295795/example.org?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJodHRwczovL2V4YW1wbGUuY29tL1wiLFwiaWRcIjpcImNjNTgxZGNhMGJiMDRlZTBiYTNkOTkwYzg1OWJlMTE0XCIsXCJ1cmxfaWRzXCI6W1wiNWMzYTcyNjNkMDgzODdmNzMxOTE2NTRmNzI1ZTVjMGJjZDRlZjhjY1wiXX0ifQ',
    )

    expect(unwrapMandrill(value)).toBeUndefined()
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'http://mandrillapp.com/track/click.php?u=3541274&id=acd0abe879a143b4a5ed32beba272b35&url=http%3A%2F%2Fexample.com%2Fsign_up%3Freferrer_id%3D3055614%23top&url_id=8f1d5a3c',
    )
    const expected = 'http://example.com/sign_up?referrer_id=3055614#top'

    expect(unwrapMandrill(value)).toBe(expected)
  })
})
