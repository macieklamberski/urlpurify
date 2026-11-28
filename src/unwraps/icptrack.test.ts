import { describe, expect, it } from 'bun:test'
import { unwrapperHosts } from '../utils.js'
import { unwrapIcptrack } from './icptrack.js'

describe('unwrapIcptrack', () => {
  it('should extract target from destination param', () => {
    const value = new URL(
      'https://click.icptrack.com/icp/relay.php?r=1&msgid=2&destination=https%3A%2F%2Fexample.com%2Farticle',
    )
    const expected = 'https://example.com/article'

    expect(unwrapIcptrack(value)).toBe(expected)
  })

  it('should extract target from destination param on rclick.php', () => {
    const value = new URL(
      'https://click.icptrack.com/icp/rclick.php?cid=1285186&mid=297655&destination=http%3A%2F%2Fexample.com%2Fcareers%2F&cfid=5764&vh=d832a1b744aaa4a144d93b52ffafe94e',
    )
    const expected = 'http://example.com/careers/'

    expect(unwrapIcptrack(value)).toBe(expected)
  })

  it('should extract target from destination param on rclick.php with a d param', () => {
    const value = new URL(
      'http://click.icptrack.com/icp/rclick.php?d=kcwfMSxaeZxFi1idPYdaqAyuWi4Aigjc&w=1&destination=http%3A%2F%2Fwww.example.com',
    )
    const expected = 'http://www.example.com'

    expect(unwrapIcptrack(value)).toBe(expected)
  })

  it('should return undefined when destination param is empty on rclick.php', () => {
    const value = new URL('https://click.icptrack.com/icp/rclick.php?cid=1285186&destination=')

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined for destination param below the rclick.php path', () => {
    const value = new URL(
      'https://click.icptrack.com/icp/rclick.php/extra?destination=https%3A%2F%2Fexample.com',
    )

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined for rclick.php below another path', () => {
    const value = new URL(
      'https://click.icptrack.com/prefix/icp/rclick.php?destination=https%3A%2F%2Fexample.com',
    )

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined for a path that only resembles rclick.php', () => {
    const value = new URL(
      'https://click.icptrack.com/icp/rclickxphp?destination=https%3A%2F%2Fexample.com',
    )

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined for non-relay paths', () => {
    const value = new URL('https://click.icptrack.com/other?destination=https%3A%2F%2Fexample.com')

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined when destination param is missing', () => {
    const value = new URL('https://click.icptrack.com/icp/relay.php?r=1&msgid=2')

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined for non-ICPTrack hosts', () => {
    const value = new URL('https://example.com/icp/relay.php?destination=https%3A%2F%2Fother.com')

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should extract target from an account host', () => {
    const value = new URL(
      'https://click-1346310.icptrack.com/icp/relay.php?destination=https%3A%2F%2Fexample.com%2Fpage',
    )
    const expected = 'https://example.com/page'

    expect(unwrapIcptrack(value)).toBe(expected)
  })

  it('should return undefined for a lookalike host', () => {
    const value = new URL(
      'https://exampleicptrack.com/icp/relay.php?destination=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined for the root path of an account host', () => {
    const value = new URL(
      'https://click-1346310.icptrack.com/?destination=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should extract target from ic1.icptrack.com', () => {
    const value = new URL(
      'https://ic1.icptrack.com/icp/relay.php?destination=https%3A%2F%2Fexample.com%2Fpage',
    )
    const expected = 'https://example.com/page'

    expect(unwrapIcptrack(value)).toBe(expected)
  })

  it('should return undefined for an unlisted subdomain', () => {
    const value = new URL(
      'https://track.icptrack.com/icp/relay.php?destination=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined for a click host without a numeric account', () => {
    const value = new URL(
      'https://click-abc.icptrack.com/icp/relay.php?destination=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined for a lookalike click host', () => {
    const value = new URL(
      'https://exampleclick.icptrack.com/icp/relay.php?destination=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined for a host that only starts with an account host', () => {
    const value = new URL(
      'https://click.icptrack.com.example.net/icp/relay.php?destination=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined for a sibling of ic1', () => {
    const value = new URL(
      'https://ic2.icptrack.com/icp/relay.php?destination=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should return undefined for an account host with no digits', () => {
    const value = new URL(
      'https://click-.icptrack.com/icp/relay.php?destination=https%3A%2F%2Fexample.com%2F',
    )

    expect(unwrapIcptrack(value)).toBeUndefined()
  })

  it('should register its hosts so the host index skips it on other hosts', () => {
    expect(unwrapperHosts.has(unwrapIcptrack)).toBe(true)
  })
})
