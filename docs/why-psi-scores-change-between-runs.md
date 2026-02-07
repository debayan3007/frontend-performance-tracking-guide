# Why PSI Scores Change Between Runs

A common source of confusion in performance monitoring is the expectation that PageSpeed Insights (PSI) scores should be stable between runs.

In reality, PSI scores -- and the underlying Lighthouse lab metrics -- can vary significantly even when nothing in your code has changed.

This is not a bug.
It is a direct consequence of how lab performance testing works.

Understanding this variance is essential for designing reliable monitoring systems and trustworthy alerting.

## The Snapshot Problem

PSI is designed to answer:

"How does this page perform right now under simulated conditions?"

It is not designed to answer:

"How is performance trending over time?"

Each PSI run is effectively an independent experiment:

- fresh network conditions
- fresh compute conditions
- fresh backend state
- fresh third-party behavior

If you treat each run as ground truth, monitoring will produce noise instead of signal.

## Where Variance Actually Comes From

Variance is not random chaos.
It usually comes from identifiable system behavior.

### Network Variability

Even in controlled lab testing:

- DNS resolution can vary
- TCP connection timing can vary
- CDN edge selection can change
- packet loss and routing latency fluctuate

Small network timing differences can cascade into larger rendering differences.

### Backend State Variability

Many production systems are not fully deterministic:

- cache warm vs cold responses
- autoscaling instance differences
- database load variation
- background job contention

If backend TTFB shifts slightly, downstream rendering timing shifts too.

### CPU Scheduling and Simulation Noise

Lighthouse simulates mobile CPU constraints.

Even in controlled environments:

- CPU scheduling varies
- thread contention varies
- garbage collection timing varies

This especially affects:

- INP
- LCP when render-blocking work is present

### Third-Party Script Timing

Third-party scripts are one of the largest variance drivers.

Examples:

- analytics scripts
- ad networks
- tag managers
- personalization engines

These often introduce non-deterministic timing into critical rendering phases.

### Resource Prioritization Differences

Browsers dynamically prioritize resource loading.

Small timing differences can cause:

- different request ordering
- different main-thread blocking patterns
- different render milestone timing

This especially impacts LCP.

## Why LCP Is Especially Variable

LCP depends on a chain of events:

**Network -> HTML -> Critical CSS -> Render -> Image Load -> Paint**

Small variation anywhere shifts final LCP timing.

LCP variance across runs of +/-200-500ms is not unusual in real-world systems.

## Why Scores Change More Than You Expect

The performance score is not a direct metric.
It is a weighted composite.

Small metric changes can produce larger score changes.

**Example:**

- LCP moves from 2.3s -> 2.6s
- Score weight boundary shifts
- Score drops disproportionately

Score volatility is normal near category thresholds.

## Mobile vs Desktop Variance Differences

Mobile lab tests tend to show more variance due to:

- CPU throttling simulation
- lower bandwidth simulation
- higher sensitivity to main thread blocking

Desktop tests tend to be:

- more stable
- more network dominated
- less CPU sensitive

Monitoring systems should treat these separately.

## The Lab vs Field Reality Gap

PSI mixes two worlds:

**Lab Data:**

- controlled synthetic testing
- repeatable but noisy

**Field Data:**

- real user data
- stable but delayed
- aggregated percentiles

Monitoring systems must understand which signal they are using.

## What This Means For Monitoring

If you alert on single PSI runs:

You will get:

- false positives
- alert fatigue
- loss of developer trust

Instead, monitoring systems should use:

- rolling averages
- multi-run confirmation
- trend detection
- baseline comparison

## Practical Monitoring Strategies

### Strategy 1 -- Rolling Average Evaluation

Instead of:

Alert if LCP > threshold once

Use:

Alert if avg(LCP last 3 runs) > threshold

### Strategy 2 -- Consecutive Breach Detection

Alert if LCP exceeds threshold 3 runs in a row

### Strategy 3 -- Baseline Deviation

Alert if LCP increases 20% vs 7-day average

### Strategy 4 -- Combined Signal Confidence

Alert if:
- Rolling avg breached
- AND
- 2 consecutive breaches observed

## What "Normal Variance" Looks Like

Typical ranges (very rough real-world observations):

| Metric | Typical Run-to-Run Variance |
|--------|-----------------------------|
| LCP    | +/-100-500ms                |
| CLS    | +/-0.01-0.05               |
| INP    | +/-20-80ms                  |
| Score  | +/-3-10 points             |

Variance beyond this may indicate real change -- but context matters.

## Designing Systems That Accept Variance

Good systems assume:

- Metrics are probabilistic signals
- Trends matter more than single values
- Direction matters more than spikes
- Context matters more than thresholds

## The Mental Model Shift

**Bad mental model:**

"Performance score is a fixed truth."

**Good mental model:**

"Performance score is a sample from a noisy distribution."

Monitoring is about detecting distribution shift -- not individual outliers.

## When You Should Care About Single Runs

Single-run anomalies matter when:

- catastrophic regressions occur
- infrastructure outages happen
- deployments break rendering entirely

But these are rare compared to gradual regressions.

## The Practical Takeaway

PSI variance is not a flaw.

It is a signal that performance is influenced by:

- distributed systems behavior
- real network variability
- runtime execution timing

Monitoring systems must be built to interpret this reality.

## If You Don't Want To Build This Yourself

If you just want something that already handles variance-aware monitoring:

[https://app.webvitalskit.com](https://app.webvitalskit.com)
