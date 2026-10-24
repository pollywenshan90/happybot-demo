import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPreview, confirmRoutine } from "../src/routines/preview.js";

test("preview names the device and the change", () => {
  const p = buildPreview([{ deviceId: "l1", action: "set_brightness", params: { level: 20 } }], { l1: { name: "Bedroom lamp" } });
  assert.deepEqual(p[0], { step: 1, device: "Bedroom lamp", change: "Dim to 20%" });
});
test("confirmation is required before execution", () => {
  assert.throws(() => confirmRoutine([], {}));
});
