// Planning API contract v1 (agreed with Cyberdyne Engineering) – HBT-10
// Input: goal text, household device inventory, requesting user's role.
// Output: ordered list of proposed actions. The planner proposes only; it never executes.

export const CONTRACT_VERSION = 1;

/**
 * @typedef {Object} PlanRequest
 * @property {string} goal            e.g. "Get ready for bedtime"
 * @property {Device[]} devices       household device inventory
 * @property {"owner"|"guest"} role   requesting user's household role
 *
 * @typedef {Object} ProposedAction
 * @property {string} deviceId
 * @property {string} action          e.g. "set_brightness", "lock"
 * @property {Object} params
 */

export function validatePlanRequest(req) {
  const errors = [];
  if (!req || typeof req.goal !== "string" || !req.goal.trim()) errors.push("goal is required");
  if (!Array.isArray(req?.devices)) errors.push("devices must be an array");
  if (!["owner", "guest"].includes(req?.role)) errors.push("role must be owner or guest");
  return { ok: errors.length === 0, errors };
}

export function validatePlanResponse(res) {
  if (!res || !Array.isArray(res.actions)) return { ok: false, errors: ["actions must be an array"] };
  const bad = res.actions.filter(a => !a.deviceId || !a.action);
  return { ok: bad.length === 0, errors: bad.length ? ["each action needs deviceId and action"] : [] };
}
