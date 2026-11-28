import { describe, expect, it } from 'bun:test'
import { purifyUrl } from '../clean.js'
import { unwrapAmazonSes } from './amazonSes.js'

const tail = '/1/0100019819a7eb85-8577ee14-6ff8-44f5-9af0-008f7ce611bd-000000/c2lnbmF0dXJl_x-y=473'

describe('unwrapAmazonSes', () => {
  it('should give https to an awstrack.me target without a scheme', () => {
    const value = `https://abcd1234.r.us-east-1.awstrack.me/L0/www.example.com/post${tail}`
    const expected = 'https://www.example.com/post'

    expect(purifyUrl(value, { unwrappers: [unwrapAmazonSes] })).toBe(expected)
  })

  it('should keep the wrapper for a target without a scheme on a sender host', () => {
    const value = `https://links.example.com/CL0/www.example.com/post${tail}`

    expect(purifyUrl(value, { unwrappers: [unwrapAmazonSes] })).toBe(value)
  })

  it('should extract target from the path', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fwww.example.com%2Fnews${tail}`,
    )
    const expected = 'https://www.example.com/news'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should extract an http target', () => {
    const value = new URL(
      `http://abcd1234.r.us-west-2.awstrack.me/L0/http:%2F%2Fexample.com%2Fevents%2F48715862${tail}`,
    )
    const expected = 'http://example.com/events/48715862'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should decode a target whose slashes are encoded twice', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%252F%252Fwww.example.com%252Fnews${tail}`,
    )
    const expected = 'https://www.example.com/news'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should extract a target with an encoded colon', () => {
    const value = new URL(
      `https://abcd1234.r.eu-west-1.awstrack.me/L0/https%3A%2F%2Fexample.com%2Fa${tail}`,
    )
    const expected = 'https://example.com/a'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should extract a target with a capitalized scheme', () => {
    const value = new URL(
      `https://abcd1234.r.eu-west-1.awstrack.me/L0/Https:%2F%2Fwww.example.com%2Fcamcorder-3272735${tail}`,
    )
    const expected = 'Https://www.example.com/camcorder-3272735'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should keep the query of the target', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2Fp%3Futm_source=newsletter%26utm_medium=email${tail}`,
    )
    const expected = 'https://example.com/p?utm_source=newsletter&utm_medium=email'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should keep the fragment of the target', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2Fa%23top${tail}`,
    )
    const expected = 'https://example.com/a#top'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should restore a percent sign the target had encoded', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2FBudget%2520Documents%2Fplan.pdf${tail}`,
    )
    const expected = 'https://example.com/Budget%20Documents/plan.pdf'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should ignore a query the feed provider appended', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F${tail}?utm_source=rss`,
    )
    const expected = 'https://example.com/'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should extract a target that is another wrapper', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2Fr%3Fu=https%253A%252F%252Fexample.org%252F%26slug=m31${tail}`,
    )
    const expected = 'https://example.com/r?u=https%3A%2F%2Fexample.org%2F&slug=m31'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should extract target on a region no specimen shows', () => {
    const value = new URL(
      `https://abcd1234.r.me-south-1.awstrack.me/L0/https:%2F%2Fexample.com%2F${tail}`,
    )
    const expected = 'https://example.com/'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should extract target on the bare domain', () => {
    const value = new URL(`https://awstrack.me/L0/https:%2F%2Fexample.com%2F${tail}`)
    const expected = 'https://example.com/'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should return undefined for the other path on the domain', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/CL0/https:%2F%2Fexample.com%2F${tail}`,
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined for the root of the domain', () => {
    const value = new URL('https://abcd1234.r.us-east-1.awstrack.me/')

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined when the signature segments are missing', () => {
    const value = new URL(
      'https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F/1',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined when the path has a segment before the tracking path', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/x/L0/https:%2F%2Fexample.com%2F${tail}`,
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined when the path has a segment after the signature', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F${tail}/extra`,
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined when the link number is not a number', () => {
    const value = new URL(
      'https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F/first/0100019819a7eb85-000000/c2ln',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined when the link number is empty', () => {
    const value = new URL(
      'https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F//0100019819a7eb85-000000/c2ln',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should extract a target with literal slashes', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https://example.com/a/b${tail}`,
    )
    const expected = 'https://example.com/a/b'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should return undefined when the target segment is empty', () => {
    const value = new URL(
      'https://abcd1234.r.us-east-1.awstrack.me/L0//1/0100019819a7eb85-000000/c2ln',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should keep the wrapper for a target that is not http', () => {
    const value = `https://abcd1234.r.us-east-1.awstrack.me/L0/mailto:%2F%2Fexample.com${tail}`

    expect(purifyUrl(value, { unwrappers: [unwrapAmazonSes] })).toBe(value)
  })

  it('should keep a malformed escape in the target as written', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F%E0%A4%A${tail}`,
    )
    const expected = 'https://example.com/%E0%A4%A'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should return undefined for the same shape on another host', () => {
    const value = new URL(`https://tracking.example.com/L0/https:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined for a host that only ends in the domain name', () => {
    const value = new URL(`https://exampleawstrack.me/L0/https:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should extract target on a custom domain', () => {
    const value = new URL(`https://ses.example.de/CL0/https:%2F%2Fwww.example.com%2Fnews${tail}`)
    const expected = 'https://www.example.com/news'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should extract an http target on a custom domain', () => {
    const value = new URL(`http://trail.example.org/CL0/http:%2F%2Fexample.com${tail}`)
    const expected = 'http://example.com'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should extract a target with literal slashes on a custom domain', () => {
    const value = new URL(`https://ses.example.de/CL0/https://example.com/a/b${tail}`)
    const expected = 'https://example.com/a/b'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should keep the query of the target on a custom domain', () => {
    const value = new URL(
      `https://track.example.com/CL0/https:%2F%2Fexample.com%2Fp%3Futm_source=newsletter%26utm_medium=email${tail}`,
    )
    const expected = 'https://example.com/p?utm_source=newsletter&utm_medium=email'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should ignore a query the feed provider appended on a custom domain', () => {
    const value = new URL(
      `https://t.example.com/CL0/https:%2F%2Fexample.com%2F${tail}?ref=example.org`,
    )
    const expected = 'https://example.com/'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should extract target on a custom domain that is a bare domain', () => {
    const value = new URL(`https://example.com/CL0/https:%2F%2Fexample.org%2F${tail}`)
    const expected = 'https://example.org/'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should return undefined on a custom domain when the message id does not end in -000000', () => {
    const value = new URL(
      'https://ses.example.de/CL0/https:%2F%2Fexample.com%2F/1/0100019819a7eb85-8577ee14-6ff8-44f5-9af0-008f7ce611bd-000001/c2ln',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain when the message id has no -000000', () => {
    const value = new URL(
      'https://ses.example.de/CL0/https:%2F%2Fexample.com%2F/1/0100019819a7eb85/c2ln',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain when the message id ends in more zeros', () => {
    const value = new URL(
      'https://ses.example.de/CL0/https:%2F%2Fexample.com%2F/1/0100019819a7eb85-0000000/c2ln',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain when the message id is only -000000', () => {
    const value = new URL('https://ses.example.de/CL0/https:%2F%2Fexample.com%2F/1/-000000/c2ln')

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain when the link number is empty', () => {
    const value = new URL(
      'https://ses.example.de/CL0/https:%2F%2Fexample.com%2F//0100019819a7eb85-000000/c2ln',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain for a path with another letter before L0', () => {
    const value = new URL(`https://ses.example.de/XL0/https:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain when the signature is missing', () => {
    const value = new URL(
      'https://ses.example.de/CL0/https:%2F%2Fexample.com%2F/1/0100019819a7eb85-8577ee14-000000',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain when the link number is missing', () => {
    const value = new URL(
      'https://ses.example.de/CL0/https:%2F%2Fexample.com%2F/0100019819a7eb85-8577ee14-000000/c2ln',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain when the link number is not a number', () => {
    const value = new URL(
      'https://ses.example.de/CL0/https:%2F%2Fexample.com%2F/first/0100019819a7eb85-000000/c2ln',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain when the path has a segment after the signature', () => {
    const value = new URL(`https://ses.example.de/CL0/https:%2F%2Fexample.com%2F${tail}/extra`)

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain when the path has a segment before the tracking path', () => {
    const value = new URL(`https://ses.example.de/x/CL0/https:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain when the target segment is empty', () => {
    const value = new URL('https://ses.example.de/CL0//1/0100019819a7eb85-000000/c2ln')

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain for a target that is not http', () => {
    const value = new URL(`https://ses.example.de/CL0/mailto:%2F%2Fexample.com${tail}`)

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain for the root', () => {
    const value = new URL('https://ses.example.de/')

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain for the awstrack path', () => {
    const value = new URL(`https://ses.example.de/L0/https:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined when the message id is empty', () => {
    const value = new URL(
      'https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F/1//c2ln',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined when the signature is empty', () => {
    const value = new URL(
      'https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F/1/0100019819a7eb85-8577ee14/',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should return undefined on a custom domain when the signature is empty', () => {
    const value = new URL(
      'https://ses.example.de/CL0/https:%2F%2Fexample.com%2F/1/0100019819a7eb85-8577ee14-000000/',
    )

    expect(unwrapAmazonSes(value)).toBeUndefined()
  })

  it('should keep the link fragment', () => {
    const value = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fwww.example.com%2Fnews${tail}#x`,
    )
    const expected = 'https://www.example.com/news#x'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })

  it('should keep the fragment the target carries', () => {
    const value = new URL(
      'https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fwww.example.com%2Fnews%23top/1/0100019819a7eb85-8577ee14-6ff8-44f5-9af0-008f7ce611bd-000000/c2lnbmF0dXJl_x-y=473',
    )
    const expected = 'https://www.example.com/news#top'

    expect(unwrapAmazonSes(value)).toBe(expected)
  })
})
