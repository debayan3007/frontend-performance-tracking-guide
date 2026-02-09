# Examples

These examples demonstrate core building blocks of real-world performance monitoring systems.

They are intentionally small and incomplete.  
They are meant to illustrate patterns, not production-ready architecture.

If you are building your own monitoring system, these can serve as starting points.

If you are trying to understand how performance monitoring pipelines work internally, these examples show typical data flow and design decisions.

---

## Included Examples

### basic-psi-runner.js
Minimal script to:
- Call PageSpeed Insights API
- Handle errors
- Extract raw response

---

### normalize-psi-metrics.ts
Example of converting raw PSI JSON into a normalized internal metric schema.

---

### performance-metrics-schema.sql
Simple relational schema for storing time-series performance metrics.

---

### basic-alert-evaluator.ts
Simple rolling-average alert evaluation logic.

---

### simple-monitor-scheduler.ts
Example of tiered page monitoring and safe spacing between PSI calls.

---

## Important Notes

These examples intentionally skip:

- Authentication layers
- Production logging
- Queue systems
- Retry orchestration
- Deployment config

They are learning + architecture reference examples only.
