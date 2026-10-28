import { test } from "node:test";
import assert from "node:assert/strict";
import { checkPermission, filterRoutine } from "../src/homehub/permissions.js";

test("owners can run any action", () => {
  assert.equal(checkPermission("owner", { deviceId: "front-door", action: "unlock" }).allowed, true);
});

test("guests cannot run owner-restricted actions", () => {
  const r = checkPermission("guest", { deviceId: "front-door", action: "unlock" });
  assert.equal(r.allowed, false);
  assert.match(r.reason, /owner/);
});

test("guests are denied by default until the guest list is approved (HBT-13)", () => {
  assert.equal(checkPermission("guest", { deviceId: "lamp", action: "set_brightness" }).allowed, false);
});

test("a routine is split into permitted and blocked steps with reasons", () => {
  const { permitted, blocked } = filterRoutine("guest", [
    { deviceId: "alarm", action: "disarm" },
    { deviceId: "lamp", action: "set_brightness" },
  ]);
  assert.equal(permitted.length, 0);
  assert.equal(blocked.length, 2);
  assert.ok(blocked.every(b => b.reason));
});
