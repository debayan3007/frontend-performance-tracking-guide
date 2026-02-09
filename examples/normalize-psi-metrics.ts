export type NormalizedMetrics = {
    url: string;
    device: "mobile" | "desktop";
    timestamp: string;
    lcp_ms: number | null;
    inp_ms: number | null;
    cls: number | null;
    ttfb_ms: number | null;
    score: number | null;
  };
  
  export function normalizePSI(
    raw: any,
    url: string,
    device: "mobile" | "desktop"
  ): NormalizedMetrics {
    const audits = raw?.lighthouseResult?.audits || {};
    const categories = raw?.lighthouseResult?.categories || {};
  
    return {
      url,
      device,
      timestamp: new Date().toISOString(),
  
      lcp_ms: audits["largest-contentful-paint"]?.numericValue ?? null,
      inp_ms: audits["interaction-to-next-paint"]?.numericValue ?? null,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
      ttfb_ms: audits["server-response-time"]?.numericValue ?? null,
  
      score: categories?.performance?.score
        ? categories.performance.score * 100
        : null
    };
  }
  