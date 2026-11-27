import { parseUrl, stripWww } from 'trousse'
import type { TrackingParam, TrackingValueTest } from '../types.js'

// A `ref` value with a url delimiter or whitespace is more than a host: `example.com/page` would
// parse to the hostname `example.com`.
const refDelimitersRegex = /[\s/?#\\:@]/

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
export const housekeepingParams: ReadonlyArray<TrackingParam> = Object.freeze([
  // Google Search Results.
  'usqp', // AMP cache serving artifact.

  // Yahoo / Yandex.
  'guccounter', // Yahoo/Verizon consent redirect counter.
  'guce_referrer', // Yahoo/Verizon consent redirect referrer URL.
  'guce_referrer_sig', // Yahoo/Verizon consent redirect referrer signature.

  // WordPress. Safe in feed context: feeds only serve published content, never drafts.
  'doing_wp_cron', // Triggers WP scheduled tasks. Feeds ignore this.
  'preview', // Enables draft preview. Feeds never include drafts.
  'preview_id', // Post ID for preview. Feeds never include drafts.
  'preview_nonce', // Security token for preview. Feeds never include drafts.
  'replytocom', // Comment reply form positioning. Feeds have no comments.

  // Cache busters.
  '_', // jQuery/generic timestamp cache buster.
  'timestamp', // Generic timestamp.
  'ts', // Timestamp shorthand.
  'cb', // Cache buster shorthand.
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
])
