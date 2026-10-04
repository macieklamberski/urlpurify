import { describe, expect, it } from 'bun:test'
import { unwrapIcptrack } from './icptrack.js'

describe('unwrapIcptrack', () => {
  it('should extract target from destination param', () => {
    const url = new URL(
      'https://click.icptrack.com/icp/relay.php?r=1&msgid=2&destination=https%3A%2F%2Fexample.com%2Farticle',
    )

    expect(unwrapIcptrack(url)).toBe('https://example.com/article')
  })

  it('should extract target from destination param on rclick.php', () => {
    const url = new URL(
      'https://click.icptrack.com/icp/rclick.php?cid=1285186&mid=297655&destination=http%3A%2F%2Fexample.com%2Fcareers%2F&cfid=5764&vh=d832a1b744aaa4a144d93b52ffafe94e',
    )

    expect(unwrapIcptrack(url)).toBe('http://example.com/careers/')
  })

  it('should extract target from destination param on rclick.php with a d param', () => {
    const url = new URL(
      'http://click.icptrack.com/icp/rclick.php?d=kcwfMSxaeZxFi1idPYdaqAyuWi4Aigjc&w=1&destination=http%3A%2F%2Fwww.example.com',
    )

    expect(unwrapIcptrack(url)).toBe('http://www.example.com')
  })

  it('should return undefined when destination param is empty on rclick.php', () => {
    const url = new URL('https://click.icptrack.com/icp/rclick.php?cid=1285186&destination=')

    expect(unwrapIcptrack(url)).toBeUndefined()
  })

  it('should return undefined for destination param below the rclick.php path', () => {
    const url = new URL(
      'https://click.icptrack.com/icp/rclick.php/extra?destination=https%3A%2F%2Fexample.com',
    )

    expect(unwrapIcptrack(url)).toBeUndefined()
  })

  it('should return undefined for rclick.php below another path', () => {
    const url = new URL(
      'https://click.icptrack.com/prefix/icp/rclick.php?destination=https%3A%2F%2Fexample.com',
    )

    expect(unwrapIcptrack(url)).toBeUndefined()
  })

  it('should return undefined for a path that only resembles rclick.php', () => {
    const url = new URL(
      'https://click.icptrack.com/icp/rclickxphp?destination=https%3A%2F%2Fexample.com',
    )

    expect(unwrapIcptrack(url)).toBeUndefined()
  })

  it('should return undefined for non-relay paths', () => {
    const url = new URL('https://click.icptrack.com/other?destination=https%3A%2F%2Fexample.com')

    expect(unwrapIcptrack(url)).toBeUndefined()
  })

  it('should return undefined when destination param is missing', () => {
    const url = new URL('https://click.icptrack.com/icp/relay.php?r=1&msgid=2')

    expect(unwrapIcptrack(url)).toBeUndefined()
  })

  it('should return undefined for non-ICPTrack hosts', () => {
    const url = new URL('https://example.com/icp/relay.php?destination=https%3A%2F%2Fother.com')

    expect(unwrapIcptrack(url)).toBeUndefined()
  })

  it('should extract target from an account host', () => {
    const url = new URL(
      'https://click-1346310.icptrack.com/icp/relay.php?destination=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapIcptrack(url)).toBe('https://example.com/page')
  })

  it('should return undefined for a lookalike host', () => {
    const url = new URL(
      'https://exampleicptrack.com/icp/relay.php?destination=https%3A%2F%2Fexample.com%2Fpage',
    )

    expect(unwrapIcptrack(url)).toBeUndefined()
  })
})
