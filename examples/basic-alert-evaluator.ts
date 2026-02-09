type MetricPoint = {
    lcp_ms: number;
    timestamp: string;
  };
  
  export function rollingAverage(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  
  export function evaluateLCPAlert(
    history: MetricPoint[],
    threshold = 3000,
    windowSize = 3
  ) {
    if (history.length < windowSize) {
      return { triggered: false, reason: "Not enough data" };
    }
  
    const window = history.slice(-windowSize);
    const avg = rollingAverage(window.map(v => v.lcp_ms));
  
    if (avg > threshold) {
      return {
        triggered: true,
        avg,
        threshold
      };
    }
  
    return { triggered: false };
  }
  