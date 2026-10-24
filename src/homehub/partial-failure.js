// Unavailable devices and partial failures – HBT-12
// If a device is unavailable, skip that action, continue where safe,
// and tell the user exactly what did not run.

export function summariseRun(results) {
  const skipped = results.filter(r => r.status === "unavailable");
  return {
    completed: results.length - skipped.length,
    skipped: skipped.map(r => r.deviceName),
    message: skipped.length ? `Didn't run: ${skipped.map(r => r.deviceName).join(", ")} (unavailable)` : "All steps completed",
  };
}
