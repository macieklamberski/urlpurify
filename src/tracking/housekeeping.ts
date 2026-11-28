import { parseUrl, stripWww } from 'trousse'
import type { TrackingParam, TrackingValueTest } from '../types.js'

// A `ref` value with a url delimiter or whitespace is more than a host: `example.com/page` would
// parse to the hostname `example.com`.
const refDelimitersRegex = /[\s/?#\\:@]/

// A hex `preview`, as `preview=1`, is a draft flag. A word such as `preview=inline` picks a card
// layout and stays, and so does an empty `preview=`.
const hexValueRegex = /^[0-9a-f]+$/i

// A cache buster is a timestamp, a hash or a random number: hex, a fractional timestamp such as
// `1782597425.17810722`, a `Math.random()` value such as `0.1538`, or empty, which selects nothing.
// A word stays: `ts=posts` picks a comments feed's type and `cb=googleTranslateElementInit` names
// a JSONP callback.
const cacheBusterValueRegex = /^(?:[0-9a-f]*|\d+\.\d+)$/i

// A `ref` holding the URL's own host is Ghost's self-referral, `?ref=example.com` on example.com.
// With any other value `ref` is often a real referral target.
const isSelfReferral: TrackingValueTest = (value, host) => {
  if (refDelimitersRegex.test(value)) {
    return false
  }

  // The URL parser gives `url.hostname` in lowercase Punycode, so `ref` goes through the same
  // host parsing: `?ref=bücher.example` names `xn--bcher-kva.example`.
  const refUrl = parseUrl(`http://${value}`)

  if (!refUrl) {
    return false
  }

  return stripWww(refUrl.hostname) === host
}

// Cache busters, previews and redirect leftovers. Stripping them costs nobody anything.
export const housekeepingParams: Array<TrackingParam> = [
  // Google Search Results.
  'usqp', // AMP cache serving artifact.

  // Yahoo / Yandex.
  'guccounter', // Yahoo/Verizon consent redirect counter.
  'guce_referrer', // Yahoo/Verizon consent redirect referrer URL.
  'guce_referrer_sig', // Yahoo/Verizon consent redirect referrer signature.

  // WordPress. Safe in feed context: feeds only serve published content, never drafts.
  'doing_wp_cron', // Triggers WP scheduled tasks. Feeds ignore this.
  { name: 'preview', value: hexValueRegex }, // Enables draft preview. Feeds never include drafts.
  'preview_id', // Post ID for preview. Feeds never include drafts.
  'preview_nonce', // Security token for preview. Feeds never include drafts.
  'replytocom', // Comment reply form positioning. Feeds have no comments.

  // Cache busters.
  { name: '_', value: cacheBusterValueRegex }, // jQuery/generic timestamp cache buster.
  'timestamp', // Generic timestamp.
  { name: 'ts', value: cacheBusterValueRegex }, // Timestamp shorthand.
  { name: 'cb', value: cacheBusterValueRegex }, // Cache buster shorthand.
  'cachebuster', // Generic cache buster.
  // 'cHash', // TYPO3 security hash. Required for TYPO3 pages to render.
  'nocache', // Force bypass cache.
  'rand', // Random value.
  'random', // Random value.
  'sbdcrw', // Unknown cache buster.
  'forceByPassCache', // Force cache bypass.
  'sucurianticache', // Sucuri CDN cache bypass.
  'cleancache', // Force cache clear.
  'rebuildcache', // Force cache rebuild.
  'kontrol_health_check_timestamp', // Kontrol health monitoring.

  // A/B testing.
  // 'userab', // A/B test variant. May affect which content is served.

  // Adobe Target.
  'at_preview_index', // Preview index.

  // Reader apps.
  '__readwiseLocation', // Readwise Reader position tracking.

  // Ghost.
  { name: 'ref', value: isSelfReferral }, // Self-referral naming the url's own host.
]
