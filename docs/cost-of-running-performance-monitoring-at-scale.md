# Cost of Running Performance Monitoring At Scale

Performance monitoring often starts as a small script and grows into a production system.

Early cost feels negligible.
At scale, cost can grow faster than expected -- especially if sampling strategy and storage design are not planned early.

This document explains where real costs come from in performance monitoring systems and how teams typically control them.

## The Hidden Truth: Monitoring Cost Scales Along Multiple Axes

Monitoring cost does not scale linearly.

It scales across:

- Number of pages monitored
- Frequency of testing
- Number of device profiles (mobile vs desktop)
- Data retention duration
- Storage query complexity
- Alert processing overhead

Understanding these multipliers early prevents unpleasant surprises later.

## The 5 Primary Cost Buckets

### 1. Metric Collection Cost

Includes:

- PSI API quota usage
- Compute cost for workers
- Network egress (usually minor)

### 2. Storage Cost

Includes:

- Raw metric storage
- Aggregated metric storage
- Index storage
- Backup storage

### 3. Processing Cost

Includes:

- Alert evaluation
- Trend computation
- Aggregation pipelines

### 4. Visualization Cost

Includes:

- Dashboard compute
- Query execution cost
- Data caching layers

### 5. Operational Cost (Often Ignored)

Includes:

- engineering time
- alert tuning time
- infra maintenance time

Operational cost often dominates infra cost in small teams.

## Cost Scaling Example (Simple Math)

Example scenario:

- 10 pages
- Run every 3 hours
- Mobile + Desktop

= 2 runs x 8 times/day x 10 pages = **160 PSI calls per day**

Scale to:

- **100 pages** = 1600 PSI calls/day

Scale to:

- **1000 pages** = 16,000 PSI calls/day

Now storage and alert cost scale similarly.

## PSI API Cost Reality

PSI is usually quota-limited before cost-limited.

But quota exhaustion creates indirect cost:

- missing data
- monitoring gaps
- need for retry logic

Real cost comes from: **infrastructure to manage rate limiting safely**

## Worker / Compute Cost

Usually small compared to storage and operational cost.

Typical patterns:

- **Small system:** $5-20 / month
- **Medium scale:** $20-100 / month
- **Large scale:** Mostly driven by storage + analytics

## Storage Cost -- Where Things Get Expensive

Storage cost grows fast if you store:

- raw JSON forever
- high frequency raw metrics
- uncompressed historical data

### Rough Storage Growth Example

Assume: 1 record = ~1 KB normalized

If: 100 pages, every 3 hours
= ~800 records/day = ~24K records/month = **~24 MB/month**

Scale to 1000 pages: **~240 MB/month**

Add raw JSON -> multiply by 5-10x.

## The Real Storage Killers

### Storing Raw PSI JSON Forever

Very expensive long term.

**Solution:** Keep raw JSON short-term only.

### No Retention Policies

Storage silently grows forever.

**Solution:** Implement retention from day one.

### No Aggregation Strategy

Query cost increases with data size.

**Solution:** Add daily/hourly aggregates later.

## Alert Processing Cost

Usually low early.

But grows when:

- page count grows
- metric count grows
- alert rules grow
- evaluation frequency grows

Good design keeps alert compute predictable.

## Visualization Cost

Can become expensive if:

- dashboards query raw metrics directly
- no caching layer exists
- queries scan large time ranges repeatedly

**Solution:** Precompute aggregates.

## The Most Expensive Cost -- Engineering Time

Most teams underestimate this.

Costs come from:

- debugging alert noise
- fixing pipeline failures
- maintaining schema migrations
- managing data cleanup
- tuning alert thresholds

Tools that reduce maintenance often win over cheaper infra.

## The Biggest Cost Explosion Triggers

### Explosion Trigger 1 -- Monitoring Too Many Pages Too Early

**Solution:** Tier page monitoring.

### Explosion Trigger 2 -- Running Tests Too Frequently

Beyond hourly, returns drop quickly.

### Explosion Trigger 3 -- Infinite Raw Data Retention

Raw data is expensive long term.

### Explosion Trigger 4 -- Overbuilding Early Architecture

Complex infra costs more to maintain than to run.

## The Cheapest High-Signal Monitoring Strategy

If optimizing for cost:

- **Monitor:** Top 5-20 pages only
- **Run:** Every 3-6 hours
- **Store:** Normalized metrics only long-term
- **Retain:** Raw data -> 30-60 days; Aggregates -> Long term

## Realistic Cost Tiers

### Small Team

$10-50 / month. Mostly infra + storage.

### Growing Product

$50-300 / month. Storage + aggregation + analytics.

### Large Scale Monitoring

Dominated by:

- storage
- analytics compute
- engineering maintenance

## The Most Cost-Efficient Monitoring Pattern

Tiered monitoring + smart retention + aggregation.

This combination beats almost all naive monitoring setups.

## The Mental Model

Monitoring cost grows based on:

**Pages x Frequency x Metrics x Retention x Complexity**

If you control:

- page selection
- sampling frequency
- retention strategy

You control cost.

## The Practical Scaling Strategy

**Stage 1:** Few pages, simple storage, short retention

**Stage 2:** Tiered monitoring, longer history, aggregates added

**Stage 3:** Smart sampling, adaptive monitoring, data lifecycle automation

## The Practical Takeaway

Most teams overspend on: **Monitoring too much too early.**

Most teams underspend on: **Alert quality and signal clarity.**

Signal quality saves more engineering time than raw monitoring volume.

## If You Don't Want To Build This Yourself

If you want something that already balances monitoring cost, storage, and signal quality:

[https://app.webvitalskit.com](https://app.webvitalskit.com)
