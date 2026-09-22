import type { Presentation } from "../domain/presentation";
import type { DemoScenario, StageId } from "../domain/types";
import { formatCompactDate } from "../utils/dates";

/** A scene the visitor scrolls through. `focus` selects the camera shot in the 3D model. */
export interface JourneyChapter {
  id: string;
  /** Camera and emphasis key shared with src/experience/three/createSupplyScene.ts. */
  focus:
    | "demand"
    | "supplier"
    | "inbound"
    | "receiving"
    | "inventory"
    | "order"
    | "pickpack"
    | "delivery";
  stage: StageId;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Canonical figures for this beat; never screen-local invention. */
  metrics: { label: string; value: string; note?: string }[];
  entities: string[];
  /** True once the scenario state behind this beat has actually been executed. */
  done: boolean;
}

/**
 * The eight scroll chapters that carry Demand → PO → Receipt → Inventory →
 * Order → Fulfillment → Shipment → Delivery. Every figure comes from the
 * shared scenario, so scrolling narrates state without ever changing it.
 */
export function buildJourneyChapters(
  scenario: DemoScenario,
  p: Presentation,
): JourneyChapter[] {
  const { timeline } = scenario.metadata;
  const status = p.shipment.status.replaceAll("_", " ").toLowerCase();
  return [
    {
      id: "demand",
      focus: "demand",
      stage: "demand",
      label: "Demand signal",
      eyebrow: `01 / DEMAND · ${formatCompactDate(timeline.demandReviewedAt)}`,
      title: "A promotion becomes a number.",
      body: `A Back-to-School promotion lifts expected demand for ${p.forecast.sku}. The forecast, the target ending stock, and the available balance resolve into one replenishment requirement for ${scenario.warehouses[0].name}.`,
      metrics: [
        { label: "Forecast", value: String(p.forecast.forecastQty), note: "units" },
        { label: "Target ending", value: String(p.forecast.targetEndingQty), note: "units" },
        { label: "Requirement", value: String(p.requirement), note: "to replenish" },
      ],
      entities: [p.forecast.sku, p.forecast.id],
      done: p.approved,
    },
    {
      id: "sourcing",
      focus: "supplier",
      stage: "sourcing",
      label: "Supplier commitment",
      eyebrow: `02 / SOURCING · ${formatCompactDate(timeline.purchaseOrderConfirmedAt)}`,
      title: "The gap becomes a commitment.",
      body: `${p.po.id} sends the requirement to ${p.supplier.name}. The purchase order carries the forecast decision forward, so the units arriving later are traceable to the demand that asked for them.`,
      metrics: [
        { label: "Ordered", value: String(p.incoming), note: p.forecast.sku },
        { label: "PO status", value: p.po.status.toLowerCase() },
        { label: "Expected", value: formatCompactDate(p.po.expectedAt) },
      ],
      entities: [p.po.id, p.supplier.name],
      done: p.confirmed,
    },
    {
      id: "inbound-transit",
      focus: "inbound",
      stage: "sourcing",
      label: "Inbound transit",
      eyebrow: "03 / INBOUND · IN MOTION",
      title: "The commitment travels.",
      body: `${p.incoming} units leave ${p.supplier.name} for the receiving dock. Nothing in the plan has to be re-entered: the inbound load already knows which requirement it answers.`,
      metrics: [
        { label: "In transit", value: String(p.incoming), note: "units inbound" },
        { label: "Destination", value: scenario.warehouses[0].name },
        { label: "Due", value: formatCompactDate(p.po.expectedAt) },
      ],
      entities: [p.po.id, scenario.warehouses[0].name],
      done: p.received,
    },
    {
      id: "receiving",
      focus: "receiving",
      stage: "inbound",
      label: "Receiving",
      eyebrow: `04 / RECEIPT · ${formatCompactDate(timeline.receiptPostedAt)}`,
      title: "Arrival, posted once.",
      body: `${p.receipt.id} posts the delivery against ${p.po.id} and puts the units away at ${p.location.code}. One receipt updates the balance every downstream team reads.`,
      metrics: [
        { label: "Receipt", value: p.receipt.status.toLowerCase() },
        { label: "Put away", value: p.location.code, note: `zone ${p.location.zone}` },
        { label: "Quantity", value: String(p.incoming), note: "units" },
      ],
      entities: [p.receipt.id, p.location.code],
      done: p.received,
    },
    {
      id: "inventory",
      focus: "inventory",
      stage: "inbound",
      label: "Inventory position",
      eyebrow: "05 / INVENTORY · SHARED BALANCE",
      title: "One balance. Every team.",
      body: `On hand, reserved, and available stay in step: available is always on hand minus reserved. Planning, order management, and the warehouse floor are looking at the same ${p.forecast.sku} position.`,
      metrics: [
        { label: "On hand", value: String(p.inventory.onHand) },
        { label: "Reserved", value: String(p.inventory.reserved) },
        { label: "Available", value: String(p.available) },
      ],
      entities: [p.forecast.sku, p.location.code],
      done: p.received,
    },
    {
      id: "orders",
      focus: "order",
      stage: "orders",
      label: "Customer order",
      eyebrow: `06 / ORDER · ${formatCompactDate(timeline.salesOrderPlacedAt)}`,
      title: "A promise with stock behind it.",
      body: `${p.customer.name} orders ${p.orderQty} × ${p.forecast.sku}. Allocating ${p.order.id} reserves those units against the same balance, so the promise is backed by inventory rather than hope.`,
      metrics: [
        { label: "Order", value: p.order.status.toLowerCase() },
        { label: "Quantity", value: String(p.orderQty), note: p.forecast.sku },
        { label: "Promised by", value: formatCompactDate(p.order.promisedBy) },
      ],
      entities: [p.order.id, p.customer.name],
      done: p.allocated,
    },
    {
      id: "fulfillment",
      focus: "pickpack",
      stage: "fulfillment",
      label: "Pick & pack",
      eyebrow: `07 / FULFILLMENT · ${formatCompactDate(timeline.packCompletedAt)}`,
      title: "The order becomes work.",
      body: `The pick task sends an operator to ${p.location.code} for ${p.pickTask.requiredQty} units, and the pack task closes them into ${p.packTask.packageId}. Warehouse execution stays attached to ${p.order.id} the whole way.`,
      metrics: [
        { label: "Pick", value: p.pickTask.status.replaceAll("_", " ").toLowerCase() },
        { label: "Pack", value: p.packTask.status.toLowerCase() },
        { label: "Package", value: p.packTask.packageId },
      ],
      entities: [p.pickTask.id, p.packTask.packageId],
      done: p.packed,
    },
    {
      id: "delivery",
      focus: "delivery",
      stage: "shipment",
      label: "Dispatch & delivery",
      eyebrow: `08 / DELIVERY · ${formatCompactDate(timeline.shipmentDeliveredAt)}`,
      title: "The thread reaches the door.",
      body: `${p.shipment.id} leaves the dock with ${p.carrier.name}. Dispatch releases the reservation and reduces on hand once, and every carrier milestone stays joined to ${p.order.id} and the forecast that started it.`,
      metrics: [
        { label: "Shipment", value: status },
        { label: "Carrier", value: p.carrier.name },
        { label: "Customer", value: p.customer.name },
      ],
      entities: [p.shipment.id, p.order.id],
      done: p.delivered,
    },
  ];
}
