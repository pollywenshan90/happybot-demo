// Guest permission checks for Smart Routines – HBT-14
// Agreed principle (Household Permissions Decision Log):
//   guests cannot execute owner-restricted actions.
// The exact guest-action list is still awaiting approval from
// Cyberdyne Security (HBT-13), so guests are denied by default for now.

/** Actions that only a household owner may run. */
export const OWNER_RESTRICTED = new Set([
  "unlock",            // door locks
  "disarm",            // security system
  "disable_camera",    // cameras
]);

/**
 * Actions guests may run. Intentionally empty until HBT-13 is approved.
 * TODO(HBT-13): replace with the approved guest-action list.
 */
export const GUEST_ALLOWED = new Set();

/**
 * Decide whether a household member may run a proposed action.
 * @param {"owner"|"guest"} role
 * @param {{deviceId: string, action: string}} proposed
 * @returns {{allowed: boolean, reason?: string}}
 */
export function checkPermission(role, proposed) {
  if (role === "owner") return { allowed: true };
  if (role !== "guest") return { allowed: false, reason: "Unknown household role" };
  if (OWNER_RESTRICTED.has(proposed.action)) {
    return { allowed: false, reason: "Only the household owner can do this" };
  }
  if (!GUEST_ALLOWED.has(proposed.action)) {
    return { allowed: false, reason: "Guest access for this action hasn't been approved yet" };
  }
  return { allowed: true };
}

/** Split a proposed routine into permitted and blocked steps, with reasons. */
export function filterRoutine(role, actions) {
  const permitted = [];
  const blocked = [];
  for (const a of actions) {
    const result = checkPermission(role, a);
    (result.allowed ? permitted : blocked).push(result.allowed ? a : { ...a, reason: result.reason });
  }
  return { permitted, blocked };
}
