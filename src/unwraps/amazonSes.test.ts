import { describe, expect, it } from 'bun:test'
import { unwrapAmazonSes } from './amazonSes.js'

const tail = '/1/0100019819a7eb85-8577ee14-6ff8-44f5-9af0-008f7ce611bd-000000/c2lnbmF0dXJl_x-y=473'

describe('unwrapAmazonSes', () => {
  it('should extract target from the path', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fwww.example.com%2Fnews${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBe('https://www.example.com/news')
  })

  it('should extract an http target', () => {
    const url = new URL(
      `http://abcd1234.r.us-west-2.awstrack.me/L0/http:%2F%2Fexample.com%2Fevents%2F48715862${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBe('http://example.com/events/48715862')
  })

  it('should extract a target with an encoded colon', () => {
    const url = new URL(
      `https://abcd1234.r.eu-west-1.awstrack.me/L0/https%3A%2F%2Fexample.com%2Fa${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBe('https://example.com/a')
  })

  it('should extract a target with a capitalized scheme', () => {
    const url = new URL(
      `https://abcd1234.r.eu-west-1.awstrack.me/L0/Https:%2F%2Fwww.example.com%2Fcamcorder-3272735${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBe('Https://www.example.com/camcorder-3272735')
  })

  it('should keep the query of the target', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2Fp%3Futm_source=newsletter%26utm_medium=email${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBe(
      'https://example.com/p?utm_source=newsletter&utm_medium=email',
    )
  })

  it('should keep the fragment of the target', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2Fa%23top${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBe('https://example.com/a#top')
  })

  it('should restore a percent sign the target had encoded', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2FBudget%2520Documents%2Fplan.pdf${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBe('https://example.com/Budget%20Documents/plan.pdf')
  })

  it('should ignore a query the feed provider appended', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F${tail}?utm_source=rss`,
    )

    expect(unwrapAmazonSes(url)).toBe('https://example.com/')
  })

  it('should extract a target that is another wrapper', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2Fr%3Fu=https%253A%252F%252Fexample.org%252F%26slug=m31${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBe(
      'https://example.com/r?u=https%3A%2F%2Fexample.org%2F&slug=m31',
    )
  })

  it('should extract target on a region no specimen shows', () => {
    const url = new URL(
      `https://abcd1234.r.me-south-1.awstrack.me/L0/https:%2F%2Fexample.com%2F${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBe('https://example.com/')
  })

  it('should extract target on the bare domain', () => {
    const url = new URL(`https://awstrack.me/L0/https:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapAmazonSes(url)).toBe('https://example.com/')
  })

  it('should return undefined for the other path on the domain', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/CL0/https:%2F%2Fexample.com%2F${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined for the root of the domain', () => {
    const url = new URL('https://abcd1234.r.us-east-1.awstrack.me/')

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined when the signature segments are missing', () => {
    const url = new URL('https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F/1')

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined when the path has a segment before the tracking path', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/x/L0/https:%2F%2Fexample.com%2F${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined when the path has a segment after the signature', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F${tail}/extra`,
    )

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined when the link number is not a number', () => {
    const url = new URL(
      'https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F/first/0100019819a7eb85-000000/c2ln',
    )

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined when the link number is empty', () => {
    const url = new URL(
      'https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F//0100019819a7eb85-000000/c2ln',
    )

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined when the target has literal slashes', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https://example.com/a/b${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined when the target segment is empty', () => {
    const url = new URL(
      'https://abcd1234.r.us-east-1.awstrack.me/L0//1/0100019819a7eb85-000000/c2ln',
    )

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined for a target that is not http', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/mailto:%2F%2Fexample.com${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined for a malformed percent escape in the target', () => {
    const url = new URL(
      `https://abcd1234.r.us-east-1.awstrack.me/L0/https:%2F%2Fexample.com%2F%E0%A4%A${tail}`,
    )

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined for the same shape on another host', () => {
    const url = new URL(`https://tracking.example.com/L0/https:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })

  it('should return undefined for a host that only ends in the domain name', () => {
    const url = new URL(`https://exampleawstrack.me/L0/https:%2F%2Fexample.com%2F${tail}`)

    expect(unwrapAmazonSes(url)).toBeUndefined()
  })
})
