import fetch from "node-fetch";

const PSI_API_KEY = process.env.PSI_API_KEY;
const TARGET_URL = process.env.TARGET_URL || "https://example.com";

async function runPSI(url, strategy = "mobile") {
  const endpoint =
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed" +
    `?url=${encodeURIComponent(url)}` +
    `&strategy=${strategy}` +
    `&key=${PSI_API_KEY}`;

  try {
    const res = await fetch(endpoint);

    if (!res.ok) {
      throw new Error(`PSI request failed: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("PSI run failed:", err.message);
    return null;
  }
}

async function main() {
  const data = await runPSI(TARGET_URL);

  if (!data) {
    console.error("No PSI data returned");
    return;
  }

  console.log("PSI run successful");
  console.log(JSON.stringify(data.lighthouseResult.categories.performance.score, null, 2));
}

main();
