# urlpurify

[![codecov](https://codecov.io/gh/macieklamberski/urlpurify/branch/main/graph/badge.svg)](https://codecov.io/gh/macieklamberski/urlpurify)
[![npm version](https://img.shields.io/npm/v/urlpurify.svg)](https://www.npmjs.com/package/urlpurify)
[![license](https://img.shields.io/npm/l/urlpurify.svg)](https://github.com/macieklamberski/urlpurify/blob/main/LICENSE)

Unwrap redirect, affiliate, and tracking wrapper URLs and strip tracking parameters. Turn noisy links into clean, direct URLs.

URLs collected from feeds, emails, and social platforms rarely point straight at their destination: they pass through search-engine redirects, email security gateways, affiliate networks, and AMP caches, and carry analytics parameters that bloat the link and leak data. urlpurify ships 70+ unwrappers for known wrapper services and a list of 150+ known tracking parameters, plus a composite `cleanUrl()` that applies both. It has zero dependencies and runs in any modern JavaScript runtime, including browsers.

## Installation

```bash
npm install urlpurify
```

## Quick Start

```typescript
import { cleanUrl } from 'urlpurify'

cleanUrl('https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fpost%3Futm_source%3Dnewsletter')
// => 'https://example.com/post'
```

## API

### `cleanUrl(url, options?)`

Unwraps redirect wrappers (repeatedly, since wrappers can nest), then strips tracking parameters. When the input cannot be parsed as a URL or nothing applies, the input string is returned unchanged, so the result is always safe to display. A target that decodes to U+FFFD, such as one percent-encoded in EUC-JP or Shift_JIS, is not returned: the last hop without one is.

```typescript
import { cleanUrl, defaultUnwrappers, unwrapWebArchive } from 'urlpurify'

const cleaned = cleanUrl(url, {
  // Unwrappers to apply, first match wins per pass (omit to use defaults).
  unwrappers: [...defaultUnwrappers, unwrapWebArchive],
  // Param names (matched case-insensitively) or anchored regexes tested against the
  // lowercased name (omit to use defaults).
  trackingParams: ['fbclid', /^utm_[a-z0-9_-]+$/],
  // Maximum number of unwrap passes for nested wrappers. Defaults to 3.
  maxUnwrapDepth: 3,
})
```

### `unwrapUrl(url, unwrappers?)`

Applies the unwrappers in order (one pass) and returns the first extracted target, or `undefined` when none match or the input cannot be parsed. The target is cleaned as in `cleanUrl`: trimmed, `https:/host` repaired, and dropped when it has no host, holds a control character or decodes to U+FFFD.

### `stripTrackingParams(url, trackingParams?)`

Removes matching query parameters and returns the cleaned URL. The input is returned unchanged when nothing matches or it cannot be parsed.

Both `cleanUrl` and `stripTrackingParams` also drop a `ref` parameter when its value is the URL's own host (Ghost's self-referral `?ref=example.com` on `example.com`), regardless of the tracking list passed. With any other value `ref` is left alone, since it is often a real referral target.

A tracking list is compiled the first time it's used, and later calls with the same array reuse that result. To change the list, pass a new array. Entries pushed onto an array that's already been used are ignored.

### `createParamExtractor(config)`

Builds an unwrapper for the common case where the target URL sits in a query parameter:

```typescript
import { cleanUrl, createParamExtractor, defaultUnwrappers } from 'urlpurify'

const unwrapExample = createParamExtractor({
  domains: 'example.com', // Matches example.com and every subdomain. Also accepts an array.
  path: '/out',
  params: ['target'],
})

cleanUrl(url, { unwrappers: [...defaultUnwrappers, unwrapExample] })
```

On a domain where anyone can get a subdomain, such as a blog host, pass `hosts` instead of `domains`. It takes a host or an array of hosts, matched exactly, or a regex.

A value that is still percent-encoded after one decode and starts with `http%3A` or `https%3A` is decoded once more.

For wrappers that encode the target (base64 path segments, custom escaping), write a plain function of type `UrlUnwrapper`: it receives a `URL` and returns the target string or `undefined`.

### Defaults

`defaultTrackingParams` is the combined default list for `cleanUrl` and `stripTrackingParams`: literal names plus family regexes like `/^utm_[a-z0-9_-]+$/` that cover vendor namespaces where new variants keep appearing. Its parts are exported separately as `trackingParamsLiterals` (strings only, for consumers that need a plain string list) and `trackingParamsPatterns`. `defaultUnwrappers` is exported alongside. `defaultUnwrappers` enables a conservative subset of the catalog; everything else is exported individually for explicit opt-in.

**On by default:** redirects that only track the click — search-engine redirects and platform shims. Unwrapping them costs the destination nothing.

**Off by default:** affiliate and referral wrappers (`unwrapSkimlinks`, `unwrapAwin`, `unwrapShareasale`, `unwrapAmazonAffiliate`, `unwrapViglink`, and the rest). The reader lands on the same page either way — unwrapping only removes the writer's commission, which for a small blog is the money paying for the work. Opt in explicitly if you want them.

**Also off by default:** podcast analytics prefixes, such as `unwrapPodtrac`. The listener gets the same audio file either way. Unwrapping removes the podcaster's download counts.

Prevalence is not the test: affiliate wrappers are more common than tracking shims.

## Unwrappers

Enabled by default:

| Unwrapper | Description |
| --- | --- |
| `unwrapBing` | Bing search-result redirect (www.bing.com/ck/a?u=a1\<base64url\>) and news click (www.bing.com/news/apiclick.aspx?url=\<target\>) |
| `unwrap4pda` | 4PDA forum outbound link redirect (4pda.ru/pages/go/?u=\<target\>) |
| `unwrapAliyun` | Alibaba Cloud developer community outbound link redirect (yq.aliyun.com/go/articleRenderRedirect?url=\<target\>) |
| `unwrapAnonymTo` | anonym.to referrer anonymizer (anonym.to/?\<target\>) |
| `unwrapArxiv` | arXiv outbound link redirect (arxiv.org/ct?url=\<target\>) |
| `unwrapAsk` | Ask.com search result click redirect (wzus.ask.com/r?u=\<target\>) |
| `unwrapBabyblog` | Babyblog outbound link shim (www.babyblog.ru/redirect.php?l=\<target\>) |
| `unwrapBale` | Bale messenger outbound link redirect (l.ble.ir/?l=\<target\>) |
| `unwrapBitrix` | 1C-Bitrix outbound link counter (\<any host\>/bitrix/redirect.php?goto=\<target\>) |
| `unwrapBlueskyRedirect` | Bluesky outbound link redirect (go.bsky.app/redirect?u=\<target\>) |
| `unwrapBridgyFed` | Bridgy Fed redirect for a bridged post or profile (fed.brid.gy/r/\<target\>, also bsky.brid.gy and web.brid.gy) |
| `unwrapBusinessWire` | Business Wire release click tracker (cts.businesswire.com/ct/CT?url=\<target\>) |
| `unwrapBytedance` | ByteDance outbound link redirect (link.wtturl.cn/?target=\<target\>) |
| `unwrapCalendly` | Calendly outbound link (calendly.com/url?q=\<target\>) |
| `unwrapCanva` | Canva outbound link in published designs (www.canva.com/link?target=\<target\>) |
| `unwrapCsdn` | CSDN external link redirect (link.csdn.net/?target=\<target\>) |
| `unwrapDasBlog` | dasBlog click-through counter (\<any host\>/[\<blog\>/]ct.ashx?url=\<target\>) |
| `unwrapDatalifeEngine` | DataLife Engine leaving redirect (\<any host\>/engine/go.php?url=\<base64 target\>, also /index.php?do=go&url=\<base64 target\>) |
| `unwrapDerefMail` | GMX, WEB.DE and mail.com webmail dereferrer (deref-gmx.net/mail/client/dereferrer/?redirectUrl=\<target\>) |
| `unwrapDeviantartOutgoing` | DeviantArt outbound link shim (www.deviantart.com/\<user\>/outgoing?\<target\>) |
| `unwrapDisqus` | Disqus outbound link redirect (disq.us/url?url=\<target\> and disq.us/?url=\<target\>) |
| `unwrapDouban` | Douban external link redirect (www.douban.com/link2/?url=\<target\>) |
| `unwrapDropbox` | Dropbox outbound link redirect (www.dropbox.com/referrer_cleansing_redirect?url=\<target\>) and Paper external link (www.dropbox.com/paper/ep/redirect/external-link?url=\<target\>, also on paper.dropbox.com) |
| `unwrapDzen` | Dzen away redirect (dzen.ru/away?to=\<target\>) |
| `unwrapEvernote` | Evernote outbound link redirect (www.evernote.com/OutboundRedirect.action?dest=\<target\>) |
| `unwrapFacebookShim` | Meta link shim (l.facebook.com/l.php?u=\<target\>, also lm., www., upload., m., web., pt-br., free., business., 0. and bare facebook.com, and l.messenger.com, plus l.facebook.com/?u=\<target\>, l.facebook.com/lsr.php?u=\<target\> and the legacy www.facebook.com/l/\<token\>/\<target\> and l.facebook.com/l/\<token\>/\<target\>) |
| `unwrapFeedStatistics` | Feed Statistics WordPress plugin click counter (\<any blog\>/?feed-stats-url=\<base64 target\>) |
| `unwrapFinalsite` | Finalsite school website link counter (\<any host\>/cf_news/forward.cfm?dest=\<target\>&destkey=\<signature\>) |
| `unwrapFlipboard` | Flipboard outbound redirect (flipboard.com/redirect?url=\<target\>) |
| `unwrapFtc` | FTC leaving-site page (www.ftc.gov/now-leaving?external_url=\<target\>) |
| `unwrapGitee` | Gitee external link redirect (gitee.com/link?target=\<target\>) |
| `unwrapGoogle` | Google redirect (google.\<TLD\>/url?url=\<target\> or ?q=\<target\>) |
| `unwrapGoogleAmpViewer` | Google AMP viewer (www.google.\<TLD\>/amp/s/\<host\>/\<path\>) |
| `unwrapGoogleNews` | Google News legacy redirect (news.google.\<TLD\>/news/url?url=\<target\>) |
| `unwrapGoogleNewsModern` | Google News modern article URLs (news.google.com/articles/\<base64\>) |
| `unwrapGoogleScholar` | Google Scholar search-result redirect (scholar.google.\<TLD\>/scholar_url?url=\<target\>) |
| `unwrapHackerone` | HackerOne external link warning on reports (hackerone.com/redirect?url=\<target\>) |
| `unwrapHashnode` | Hashnode outbound redirect (hashnode.com/util/redirect?url=\<target\>) |
| `unwrapHearthis` | hearthis.at outbound link shim (hearthis.at/l.php?url=\<target\>) |
| `unwrapHirkereso` | Hírkereső news aggregator click redirect (rd.hirkereso.hu/rd/\<id\>?url=\<target\>) |
| `unwrapHorde` | Horde webmail link dereferrer (\<any host\>/horde/services/go.php?url=\<target\>, also /util/go.php) |
| `unwrapHrefLi` | href.li referrer stripper (href.li/?\<target\>), used by Tumblr |
| `unwrapIndexHu` | Index.hu and Dex.hu outbound link counter (index.hu/x.php?id=\<id\>&url=\<target\>) |
| `unwrapInfospace` | InfoSpace metasearch result click (click.infospace.com/ClickHandler.ashx?ru=\<target\>) |
| `unwrapInstagramShim` | Instagram outbound link shim (l.instagram.com with ?u=\<target\>) |
| `unwrapIrs` | IRS leaving-site page (apps.irs.gov/app/scripts/exit.jsp?dest=\<target\>) |
| `unwrapJianshuGo` | Jianshu external link redirect (links.jianshu.com/go?to=\<target\> and link.jianshu.com/?t=\<target\>) |
| `unwrapJive` | Jive community external link redirect (\<any host\>/external-link.jspa?url=\<target\>) |
| `unwrapJuejin` | Juejin external link redirect (link.juejin.cn/?target=\<target\>) |
| `unwrapLd246` | LianDi community outbound link redirect (ld246.com/forward?goto=\<target\>) |
| `unwrapLinkedin` | LinkedIn outbound link shims and click trackers (www.linkedin.com/safety/go?url=\<target\>, /redir/redirect, /redirect, /nhome/nus-redirect, /nus-trk, /e/v2, /company/\<id\>/redirect) |
| `unwrapLivejournal` | LiveJournal outbound link redirect (www.livejournal.com/away?to=\<target\>) |
| `unwrapMailRu` | Mail.ru webmail link checker (checklink.mail.ru/proxy?url=\<target\>) and click redirect (click.mail.ru/redir?u=\<target\>, also click.my.mail.ru) |
| `unwrapMarketwire` | Marketwire release click tracker (ctt.marketwire.com/?url=\<target\>) |
| `unwrapMedium` | Medium outbound link redirect (medium.com/r/?url=\<target\>) and sign-in hop (medium.com/m/global-identity?redirectUrl=\<target\>) |
| `unwrapMozillaOutgoing` | Mozilla outgoing-link redirector (outgoing.prod.mozaws.net/v1/\<hash\>/\<target\>) |
| `unwrapNaverOutgoing` | Naver outbound link redirect (cc.loginfra.com/...?u=\<target\>) and search result click (search.naver.com/p/crd/rd?u=\<target\>, also m.search.naver.com) |
| `unwrapNetcentrum` | Centrum.cz and Atlas.cz webmail dereferrer (redir.netcentrum.cz/?noaudit&url=\<target\>) |
| `unwrapNewswire` | Newswire release and email click tracker (stats.newswire.com/x/html?final=\<base64url\>, also stats.nwe.io and stats.mediadboutreach.com) |
| `unwrapNodeseek` | NodeSeek forum leaving-site page (www.nodeseek.com/jump?to=\<target\>) |
| `unwrapOkRu` | OK.ru outbound link and leaving-site page (ok.ru/dk?cmd=logExternal&st.link=\<target\>, m.ok.ru/dk?st.cmd=outLinkWarning&st.rfn=\<target\>) |
| `unwrapOsnova` | Osnova outbound link redirect on vc.ru and dtf.ru (api.vc.ru/v2.8/redirect?to=\<target\>) |
| `unwrapPhilpapers` | PhilPapers outbound link to a work's source (philpapers.org/go.pl?u=\<target\>) |
| `unwrapPinterest` | Pinterest outbound link shim (www.pinterest.com/offsite/?url=\<target\>) |
| `unwrapPocket` | Pocket redirect (getpocket.com/redirect?url=\<target\>) |
| `unwrapPrNewswire` | PR Newswire release click tracker (c212.net / edge.prnewswire.com /c/link/?u=\<target\>) |
| `unwrapPrweb` | PRWeb release click tracker (www.prweb.net/Redirect.aspx?id=\<base64\>) |
| `unwrapRamblerMail` | Rambler Mail link redirect (mail.rambler.ru/m/redirect?url=\<target\>) |
| `unwrapRedditOut` | Reddit outbound click tracker (out.reddit.com/?url=\<target\>) |
| `unwrapRediffmail` | Rediffmail webmail link redirect (www.rediffmail.com/cgi-bin/red.cgi?red=\<target\>) |
| `unwrapResearchgate` | ResearchGate dereferrer (www.researchgate.net/deref/\<target\> and go.Deref.html?url=\<target\>) |
| `unwrapSapHelp` | SAP Help Portal leaving-site page (help.sap.com/docs/link-disclaimer?site=\<target\>) |
| `unwrapSegmentfault` | Segmentfault external link redirect (link.segmentfault.com/?enc=\<base64\>) |
| `unwrapSerendipity` | Serendipity blog exit tracker (\<any host\>/[\<blog\>/]exit.php?url=\<base64\>&entry_id=\<n\>) |
| `unwrapSkyrock` | Skyrock blog outbound link redirect (www.skyrock.com/r?url=\<target\>) |
| `unwrapSoundcloud` | SoundCloud exit link (exit.sc/?url=\<target\>) |
| `unwrapSspai` | Sspai external link redirect (sspai.com/link?target=\<target\>) |
| `unwrapSteamLinkfilter` | Steam outbound link filter (steamcommunity.com/linkfilter/?url=\<target\> or ?u=\<target\>) |
| `unwrapStorify` | Storify click counter on embedded stories (stats.storify.com/record/click?redirect=\<target\>) |
| `unwrapThreadsShim` | Threads outbound link shim (l.threads.com / l.threads.net with ?u=\<target\>) |
| `unwrapTiktok` | TikTok outbound link shim for profile bio links (www.tiktok.com/link/v2?target=\<target\>) |
| `unwrapTumblr` | Tumblr outbound redirect (t.umblr.com/redirect?z=\<target\>) |
| `unwrapVanilla` | Vanilla Forums leaving page (\<any host\>/home/leaving?target=\<target\>) |
| `unwrapVbulletin` | vBulletin SEO add-on external link redirect (\<any host\>/redirect-to/?redirect=\<target\>) |
| `unwrapVirgool` | Virgool outbound link redirect (l.vrgl.ir/r?l=\<target\>) |
| `unwrapVisibli` | Visibli framed share link (\<user\>.visibli.com/\<id\>/?dst=\<target\>) |
| `unwrapVkAway` | VK away redirect (vk.com/away.php?to=\<target\>) |
| `unwrapWpPoczta` | WP Poczta and o2 webmail dereferrer (zasobygwp.pl/redirect?url=\<base64\>) |
| `unwrapXengentr` | XenGenTr external link redirect add-on for XenForo (\<any host\>/yonlendirme?to=\<base64\>) |
| `unwrapYahooJapan` | Yahoo! JAPAN click redirect (rdsig.yahoo.co.jp/.../RU=\<base64url\>/RS=...) |
| `unwrapYahooSearch` | Yahoo Search redirect (r.search.yahoo.com/.../RU=\<target\>/RK=...) |
| `unwrapYandexMail` | Yandex Mail link redirect (mail.yandex.\<TLD\>/re.jsx?l=\<base64url\>) |
| `unwrapYelp` | Yelp outbound link redirect (www.yelp.com/biz_redir?url=\<target\>, /redir) |
| `unwrapYouTube` | YouTube external redirect (www.youtube.com/redirect?q=\<target\>) |
| `unwrapZemanta` | Zemanta related-article redirect (r.zemanta.com/?u=\<target\>) |
| `unwrapZhihu` | Zhihu external redirect (link.zhihu.com/?target=\<target\>) |

Many more are available for explicit opt-in: email security gateways (Outlook SafeLinks, Proofpoint, Mimecast), affiliate networks (Awin, Skimlinks, Commission Junction), CJK platforms, AMP caches, and others. See [src/unwraps](src/unwraps) for the full catalog, each documented in its source file.
