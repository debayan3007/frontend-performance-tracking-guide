# How Often Should You Run PSI For Monitoring?

One of the first practical questions teams face when building performance monitoring is:

How often should we run PageSpeed Insights?

- Hourly?
- Daily?
- Per deployment?
- Per page?
- Only when something breaks?

The answer is not a single number.
It is a tradeoff between signal quality, cost, API limits, and engineering usefulness.

This document explains how to choose a frequency that produces meaningful performance signals without wasting quota, money, or engineering attention.

## The Core Tradeoff: Frequency vs Signal Quality

More runs does not automatically mean better monitoring.

**Too few runs:**

- Miss gradual regressions
- Provide poor trend resolution
- Delay detection

**Too many runs:**

- Burn API quota
- Increase infrastructure cost
- Increase noise without improving signal

The goal is consistent, meaningful sampling, not maximum sampling.

## How Performance Monitoring Differs From Availability Monitoring

Availability monitoring often runs every minute or even every few seconds.

Performance monitoring is different because:

- Performance changes slower than uptime
- Performance metrics are noisy
- Trends matter more than instant spikes

You usually want consistent periodic sampling, not high-frequency sampling.

## The Three Most Common Monitoring Strategies

Most production setups fall into one of these patterns.

### Strategy 1 -- Hourly Monitoring (High Signal, Higher Cost)

**Best for:**

- Revenue-critical pages
- High-traffic landing pages
- Performance-sensitive flows (checkout, login, search)

**Typical Setup:**

- Run every 60 minutes
- Separate mobile + desktop runs
- Alert using rolling windows

**Pros:**

- Fast regression detection
- Good trend resolution
- Useful for release debugging

**Cons:**

- Higher PSI quota usage
- Higher infrastructure cost

### Strategy 2 -- Every 3-6 Hours (Balanced Default)

**Best for:**

- Most production monitoring setups
- Medium traffic pages
- Teams starting performance monitoring

**Typical Setup:**

- Run 4-8 times per day
- Rolling average alerting
- Daily trend visualization

**Pros:**

- Good signal quality
- Reasonable cost
- Low noise

**Cons:**

- Slower detection than hourly
- Less granular trend data

For most teams, this is the best default starting point.

### Strategy 3 -- Daily Monitoring (Low Cost, Slow Detection)

**Best for:**

- Early-stage projects
- Low traffic pages
- Long-term trend tracking only

**Pros:**

- Very low cost
- Easy to operate

**Cons:**

- Poor regression detection speed
- Weak short-term trend visibility

Daily monitoring is usually insufficient for alert-driven workflows.

## The Hidden Factor: Page Priority Matters More Than Frequency

Instead of asking:

"How often should we run PSI?"

Better question:

"Which pages deserve higher frequency monitoring?"

Most teams benefit from tiering pages.

### Tier 1 -- Critical Business Pages

**Examples:**

- Homepage
- Checkout
- Product listing
- Authentication flows

**Recommended Frequency:** Hourly or every 2 hours

### Tier 2 -- Important But Not Revenue-Critical

**Examples:**

- Blog landing pages
- Category pages
- Feature pages

**Recommended Frequency:** Every 4-6 hours

### Tier 3 -- Long Tail Pages

**Examples:**

- Old content
- Low traffic routes

**Recommended Frequency:** Daily

## Mobile vs Desktop Frequency Strategy

Mobile performance usually changes more frequently due to:

- CPU throttling sensitivity
- Network sensitivity
- Third-party script impact

If cost is limited:

- Prioritize mobile frequency
- Run desktop less frequently

## Per Deploy Monitoring -- Should You Do It?

Yes -- but not as a replacement for scheduled monitoring.

Deploy-based PSI runs are useful for:

- catching immediate regressions
- release validation
- debugging performance changes

But they do NOT replace continuous monitoring because:

- regressions can come from infra or third parties
- deploys are not the only source of performance drift

**Best pattern:** Scheduled monitoring + deploy-triggered runs

## Cost vs Signal Tradeoff (Practical Reality)

Important realities:

Signal quality increases sharply from:

**Daily -> 6 Hour -> 3 Hour -> Hourly**

But beyond hourly, returns drop fast.

Running every 15 minutes usually adds cost without meaningful signal improvement.

## PSI Quota Considerations

**Without API key:** Very limited daily quota.

**With API key:** Much higher -- but still not unlimited.

**Typical safe patterns:**

- Space requests (avoid burst runs)
- Avoid running many pages simultaneously
- Retry carefully (retries consume quota too)

## A Practical Default Recommendation

If you are starting fresh:

**Start with:**

- Critical Pages -> Every 2-3 hours
- Important Pages -> Every 6 hours
- Long Tail Pages -> Daily

Then adjust based on:

- quota usage
- alert usefulness
- trend clarity

## Signs You Are Running Too Frequently

- You rarely see meaningful metric movement between runs
- Alerts are mostly noise
- You are hitting quota limits
- Cost grows without added insight

## Signs You Are Running Too Infrequently

- Regressions detected days after deploy
- Trend graphs look jagged and sparse
- Alerts feel "late"
- Engineers don't trust monitoring for releases

## The Maturity Curve

Most teams evolve like this:

- **Stage 1** -- Daily Runs
- **Stage 2** -- 6 Hour Runs
- **Stage 3** -- Tiered Monitoring
- **Stage 4** -- Adaptive Frequency Based On Change Rate

## Advanced Pattern: Adaptive Sampling

Some advanced systems increase frequency when instability is detected.

**Example:**

- Normal: Every 6 hours
- During incident: Every hour

This balances cost and signal.

## The Mental Model

You are not trying to measure every moment.
You are trying to detect directional change early enough to act.

Performance monitoring is sampling, not surveillance.

## Quick Decision Table

| Use Case                 | Frequency   |
|--------------------------|-------------|
| Critical revenue pages   | 1-2 hours  |
| Most production pages    | 3-6 hours  |
| Long tail content        | 24 hours   |
| Early stage monitoring  | 24 hours   |

## The Practical Takeaway

If unsure, start with:

- Every 4-6 hours
- Tier pages by importance
- Adjust based on signal usefulness

Consistency matters more than aggressiveness.

## If You Don't Want To Build This Yourself

If you want something that already handles scheduling, quota safety, and signal-aware monitoring:

[https://app.webvitalskit.com](https://app.webvitalskit.com)
