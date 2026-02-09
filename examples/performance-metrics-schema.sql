CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL,
    url TEXT NOT NULL,

    device_type TEXT NOT NULL CHECK (device_type IN ('mobile', 'desktop')),

    collected_at TIMESTAMP NOT NULL DEFAULT NOW(),

    lcp_ms NUMERIC,
    inp_ms NUMERIC,
    cls NUMERIC,
    ttfb_ms NUMERIC,
    performance_score NUMERIC
);

-- Most common query index
CREATE INDEX idx_perf_site_time
ON performance_metrics (site_id, collected_at DESC);

-- Device segmented queries
CREATE INDEX idx_perf_site_device_time
ON performance_metrics (site_id, device_type, collected_at DESC);
