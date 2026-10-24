// Cyberdyne AI planning service client – HBT-11
// Turns a household goal into proposed device actions. Proposes only; never executes.

const DEFAULT_TIMEOUT_MS = 8000;

export async function requestPlan({ goal, devices, role }, { baseUrl, fetchImpl = fetch, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetchImpl(`${baseUrl}/v1/plans`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ goal, devices, role }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`Planning service returned ${res.status}`);
    const body = await res.json();
    return body.actions ?? [];
  } finally {
    clearTimeout(timer);
  }
}

// TODO(HBT-11): retry with backoff on 5xx
// TODO(HBT-11): map planner device IDs to HomeHub device IDs
