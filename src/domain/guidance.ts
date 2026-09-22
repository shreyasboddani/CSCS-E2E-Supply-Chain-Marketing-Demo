import type { DemoScenario } from "./types";
import { getPresentation } from "./presentation";
import * as transitions from "./transitions";

/** Read-only previews use the same guarded transitions as execution. */
export function getDecisionPreview(scenario: DemoScenario) {
  const before = getPresentation(scenario);
  const next = before.next;
  if (!next) return null;
  const result = next.action === "advanceShipment"
    ? transitions.advanceShipment(scenario, before.shipment.status)
    : transitions[next.action](scenario);
  const after = getPresentation(result);
  const fields = [
    { label: "Replenishment", before: before.approved ? "Approved" : "Awaiting approval", after: after.approved ? "Approved" : "Awaiting approval" },
    { label: before.po.id, before: before.po.status, after: after.po.status },
    { label: before.receipt.id, before: before.receipt.status, after: after.receipt.status },
    { label: "On hand", before: before.inventory.onHand, after: after.inventory.onHand },
    { label: "Reserved", before: before.inventory.reserved, after: after.inventory.reserved },
    { label: "Available", before: before.available, after: after.available },
    { label: before.order.id, before: before.order.status, after: after.order.status },
    { label: "Pick task", before: before.pickTask.status, after: after.pickTask.status },
    { label: "Pack task", before: before.packTask.status, after: after.packTask.status },
    { label: before.shipment.id, before: before.shipment.status, after: after.shipment.status },
  ];
  return { label: next.label, module: next.module, action: next.action,
    changes: fields.filter(field => field.before !== field.after),
    events: result.activityEvents.slice(scenario.activityEvents.length),
  };
}
