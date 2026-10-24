// Routine preview and confirmation – HBT-8
// Every proposed action is shown with its device and what will change.
// Nothing runs until the user explicitly confirms.

export function buildPreview(actions, devicesById) {
  return actions.map((a, i) => ({
    step: i + 1,
    device: devicesById[a.deviceId]?.name ?? a.deviceId,
    change: describe(a),
  }));
}

function describe({ action, params = {} }) {
  switch (action) {
    case "set_brightness": return `Dim to ${params.level}%`;
    case "set_temperature": return `Set to ${params.celsius}°C`;
    case "lock": return "Lock";
    case "turn_off": return "Turn off";
    case "unlock": return "Unlock";
    default: return action;
  }
}

export function confirmRoutine(preview, { confirmedBy }) {
  if (!confirmedBy) throw new Error("Routine must be confirmed by a user before execution");
  return { status: "confirmed", confirmedBy, steps: preview.length, confirmedAt: new Date().toISOString() };
}
