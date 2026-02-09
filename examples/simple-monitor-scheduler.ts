import { setTimeout as sleep } from "timers/promises";

type Site = {
  url: string;
  priority: "critical" | "important" | "low";
};

const SITES: Site[] = [
  { url: "https://example.com", priority: "critical" },
  { url: "https://example.com/blog", priority: "important" }
];

function getDelay(priority: Site["priority"]) {
  if (priority === "critical") return 60_000; // 1 min spacing
  if (priority === "important") return 120_000;
  return 180_000;
}

async function runMonitoringLoop() {
  while (true) {
    for (const site of SITES) {
      console.log(`Running PSI for ${site.url}`);

      // Here you'd call PSI runner

      await sleep(getDelay(site.priority));
    }

    console.log("Cycle complete, sleeping 3 hours");
    await sleep(3 * 60 * 60 * 1000);
  }
}

runMonitoringLoop();
