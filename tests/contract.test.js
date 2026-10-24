import { test } from "node:test";
import assert from "node:assert/strict";
import { validatePlanRequest, validatePlanResponse } from "../src/planning/contract.js";

test("accepts a valid plan request", () => {
  assert.equal(validatePlanRequest({ goal: "Get ready for bedtime", devices: [], role: "owner" }).ok, true);
});
test("rejects an unknown role", () => {
  assert.equal(validatePlanRequest({ goal: "x", devices: [], role: "admin" }).ok, false);
});
test("rejects actions without a device", () => {
  assert.equal(validatePlanResponse({ actions: [{ action: "lock" }] }).ok, false);
});
