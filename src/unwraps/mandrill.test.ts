import { describe, expect, it } from 'bun:test'
import { unwrapMandrill } from './mandrill.js'

describe('unwrapMandrill', () => {
  it('should extract target from url param on click.php', () => {
    const url = new URL(
      'http://mandrillapp.com/track/click.php?u=3541274&id=acd0abe879a143b4a5ed32beba272b35&url=http%3A%2F%2Fexample.com%2Fsign_up%3Freferrer_id%3D3055614&url_id=8f1d5a3c',
    )

    expect(unwrapMandrill(url)).toBe('http://example.com/sign_up?referrer_id=3055614')
  })

  it('should extract target from the p payload', () => {
    const url = new URL(
      'https://mandrillapp.com/track/click/30295795/example.com?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJodHRwczovL2V4YW1wbGUuY29tL1wiLFwiaWRcIjpcImNjNTgxZGNhMGJiMDRlZTBiYTNkOTkwYzg1OWJlMTE0XCIsXCJ1cmxfaWRzXCI6W1wiNWMzYTcyNjNkMDgzODdmNzMxOTE2NTRmNzI1ZTVjMGJjZDRlZjhjY1wiXX0ifQ',
    )

    expect(unwrapMandrill(url)).toBe('https://example.com/')
  })

  it('should return undefined for a non-http target in the p payload', () => {
    const url = new URL(
      'https://mandrillapp.com/track/click/30295795/example.com?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJqYXZhc2NyaXB0OmFsZXJ0KDEpXCIsXCJpZFwiOlwiY2M1ODFkY2EwYmIwNGVlMGJhM2Q5OTBjODU5YmUxMTRcIixcInVybF9pZHNcIjpbXCI1YzNhNzI2M2QwODM4N2Y3MzE5MTY1NGY3MjVlNWMwYmNkNGVmOGNjXCJdfSJ9',
    )

    expect(unwrapMandrill(url)).toBeUndefined()
  })

  it('should return undefined for a p payload without an inner payload', () => {
    const url = new URL(
      'https://mandrillapp.com/track/click/30295795/example.com?p=eyJzIjoieCIsInYiOjF9',
    )

    expect(unwrapMandrill(url)).toBeUndefined()
  })

  it('should return undefined for a p payload that is not base64 JSON', () => {
    const url = new URL('https://mandrillapp.com/track/click/30295795/example.com?p=not-json')

    expect(unwrapMandrill(url)).toBeUndefined()
  })

  it('should return undefined when p param is missing', () => {
    const url = new URL('https://mandrillapp.com/track/click/30295795/example.com')

    expect(unwrapMandrill(url)).toBeUndefined()
  })

  it('should return undefined when url param is missing on click.php', () => {
    const url = new URL('http://mandrillapp.com/track/click.php?u=3541274&id=acd0abe879a1')

    expect(unwrapMandrill(url)).toBeUndefined()
  })

  it('should return undefined for click.php on another host', () => {
    const url = new URL(
      'https://example.com/track/click.php?u=3541274&id=acd0abe879a1&url=http%3A%2F%2Fexample.org%2F',
    )

    expect(unwrapMandrill(url)).toBeUndefined()
  })

  it('should return undefined for the click path below another segment', () => {
    const url = new URL(
      'https://mandrillapp.com/x/track/click/30295795/example.com?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJodHRwczovL2V4YW1wbGUuY29tL1wiLFwiaWRcIjpcImNjNTgxZGNhMGJiMDRlZTBiYTNkOTkwYzg1OWJlMTE0XCIsXCJ1cmxfaWRzXCI6W1wiNWMzYTcyNjNkMDgzODdmNzMxOTE2NTRmNzI1ZTVjMGJjZDRlZjhjY1wiXX0ifQ',
    )

    expect(unwrapMandrill(url)).toBeUndefined()
  })

  it('should return undefined for the click path without the target host', () => {
    const url = new URL(
      'https://mandrillapp.com/track/click/30295795?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJodHRwczovL2V4YW1wbGUuY29tL1wiLFwiaWRcIjpcImNjNTgxZGNhMGJiMDRlZTBiYTNkOTkwYzg1OWJlMTE0XCIsXCJ1cmxfaWRzXCI6W1wiNWMzYTcyNjNkMDgzODdmNzMxOTE2NTRmNzI1ZTVjMGJjZDRlZjhjY1wiXX0ifQ',
    )

    expect(unwrapMandrill(url)).toBeUndefined()
  })

  it('should return undefined for the click path with a segment after the target host', () => {
    const url = new URL(
      'https://mandrillapp.com/track/click/30295795/example.com/x?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJodHRwczovL2V4YW1wbGUuY29tL1wiLFwiaWRcIjpcImNjNTgxZGNhMGJiMDRlZTBiYTNkOTkwYzg1OWJlMTE0XCIsXCJ1cmxfaWRzXCI6W1wiNWMzYTcyNjNkMDgzODdmNzMxOTE2NTRmNzI1ZTVjMGJjZDRlZjhjY1wiXX0ifQ',
    )

    expect(unwrapMandrill(url)).toBeUndefined()
  })

  it('should return undefined for the click path on another host', () => {
    const url = new URL(
      'https://example.com/track/click/30295795/example.org?p=eyJzIjoiTGYyREg3SmljYjZYVDJxMGZfZ2tuWS1GNmxVIiwidiI6MSwicCI6IntcInVcIjozMDI5NTc5NSxcInZcIjoxLFwidXJsXCI6XCJodHRwczovL2V4YW1wbGUuY29tL1wiLFwiaWRcIjpcImNjNTgxZGNhMGJiMDRlZTBiYTNkOTkwYzg1OWJlMTE0XCIsXCJ1cmxfaWRzXCI6W1wiNWMzYTcyNjNkMDgzODdmNzMxOTE2NTRmNzI1ZTVjMGJjZDRlZjhjY1wiXX0ifQ',
    )

    expect(unwrapMandrill(url)).toBeUndefined()
  })
})
