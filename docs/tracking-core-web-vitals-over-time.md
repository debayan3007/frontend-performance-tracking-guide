# Tracking Core Web Vitals Over Time
## Architecture and Data Model

Most performance tooling is optimized for answering:

"How fast is this page right now?"

But real performance problems are rarely instant failures.
They are slow regressions, gradual drift, or environment-dependent degradation.

Tracking Core Web Vitals over time transforms performance from a snapshot diagnostic into a continuous system health signal.

This document covers how real monitoring systems are typically designed:

- time-series metric storage
- sampling strategy
- schema design
- historical analysis patterns

## Why Time-Series Tracking Changes Everything

**Without history:**

- Every test is isolated
- Alerts are noisy
- Trends are invisible
- Root cause analysis is slow

**With history:**

- Regressions become obvious
- Deploy impact becomes measurable
- Performance becomes observable like infrastructure metrics

Performance monitoring becomes closer to:

- logging
- metrics observability
- production telemetry

## High-Level Architecture

A typical CWV tracking system looks like:

**Scheduler -> Metric Collector -> Normalizer -> Time-Series Storage -> Analysis -> Alerting -> Visualization**

Each stage exists to solve a specific class of uncertainty.

## Step 1 -- Sampling Strategy (Before Storage Design)

Before choosing a database or schema, decide how data will be generated.

Sampling determines:

- storage cost
- query complexity
- trend resolution
- alert responsiveness

### Common Sampling Patterns

**Fixed Interval Sampling**

Example:

- Every 1 hour
- Every 3 hours
- Every 6 hours

Best for:

- trend clarity
- predictable cost
- simple queries

Most production systems start here.

**Tiered Sampling (Recommended)**

Example:

- Critical Pages -> Every 2 hours
- Important Pages -> Every 6 hours
- Long Tail Pages -> Daily

This balances:

- signal quality
- cost
- quota limits

**Event-Triggered Sampling**

Example triggers:

- Deploys
- Traffic spikes
- Incident mode

Best used as supplement, not replacement for periodic sampling.

## Step 2 -- Metric Normalization Model

Raw PSI output is not ideal for long-term storage.

Good monitoring systems convert tool output into a stable internal schema.

### Typical Normalized Metric Record

- site_id
- url
- device_type (mobile / desktop)
- timestamp
- lcp_ms
- inp_ms
- cls
- ttfb_ms
- performance_score
- source (psi / lighthouse / synthetic)
- run_id

### Why Normalization Matters

Tool outputs change.
Your storage model should not.

Normalization provides:

- query consistency
- tool flexibility
- analytics stability

## Step 3 -- Time-Series Storage Design

There are three common approaches.

### Option 1 -- Relational Time-Series Table (Most Common Early)

Example table:

```
performance_metrics
-------------------
id
site_id
url
device_type
timestamp
lcp_ms
inp_ms
cls
ttfb_ms
score
```

**Pros:**

- simple
- easy to query
- easy to migrate

**Cons:**

- can grow large quickly
- needs indexing strategy

### Option 2 -- Time-Series Databases

Examples:

- TimescaleDB
- InfluxDB

**Pros:**

- optimized for time queries
- built-in retention policies

**Cons:**

- more operational complexity

### Option 3 -- Hybrid Raw + Aggregated Storage

Store:

- raw runs (short retention)
- aggregated hourly/daily averages (long retention)

This is common in mature systems.

## Step 4 -- Indexing Strategy (Often Overlooked)

Most common query patterns:

- site + metric + time range
- site + device + time range

Typical indexes:

- (site_id, timestamp DESC)
- (site_id, device_type, timestamp DESC)

This dramatically improves dashboard performance.

## Step 5 -- Historical Analysis Patterns

**Rolling Window Analysis**

Used for:

- alerting
- trend smoothing

Example: Rolling average LCP last 3 runs

**Baseline Comparison**

Used for:

- regression detection

Example: Current LCP vs 7 day average

**Percentile Tracking**

Useful when:

- data volume grows
- distributions matter more than averages

## Step 6 -- Data Retention Strategy

Performance data gets more valuable over time -- but storage costs grow.

Common pattern:

| Data Type         | Retention    |
|-------------------|--------------|
| Raw Runs          | 30-90 days   |
| Hourly Aggregates | 6-12 months  |
| Daily Aggregates  | Multi-year   |

## Step 7 -- Handling Missing Data

Real systems must handle:

- PSI failures
- rate limiting
- network timeouts
- deployment gaps

Never assume perfect data continuity.

Use:

- null-safe trend logic
- missing run tolerance
- partial window evaluation

## Step 8 -- Visualization Considerations

Good CWV dashboards show:

- trend direction
- rolling averages
- baseline comparison
- release markers

Raw point graphs alone are misleading.

## Step 9 -- Scaling Considerations

Most systems scale in stages:

- **Stage 1** -- Single metrics table
- **Stage 2** -- Partitioned metrics table
- **Stage 3** -- Aggregation pipelines
- **Stage 4** -- Multi-tenant metric isolation

## Step 10 -- Common Mistakes

**Storing Only Latest Metrics**

Destroys trend visibility.

**Over-Storing Raw JSON Forever**

Costs explode. Query performance degrades.

**Mixing Tool Output Formats Directly**

Makes analytics brittle.

**Ignoring Device Segmentation**

Hides real regressions.

## The Mental Model

You are not storing test results.
You are building a performance telemetry system.

Treat performance metrics like:

- CPU metrics
- latency metrics
- error rate metrics

## The Real Value of Historical CWV Tracking

Once you have enough history, you can answer:

- Did performance degrade after this deploy?
- Are we trending worse month-over-month?
- Did infra changes affect user experience?
- Which pages are slowly regressing?

This is where monitoring becomes strategic, not diagnostic.

## The Practical Default Architecture

If you are starting:

- Fixed interval sampling (3-6 hours)
- Normalized relational storage
- Rolling window alerting
- 60-90 day raw retention
- Daily aggregation

This is enough to support real monitoring.

## If You Don't Want To Build This Yourself

If you want something that already handles sampling, storage design, and historical analysis:

[https://app.webvitalskit.com](https://app.webvitalskit.com)
