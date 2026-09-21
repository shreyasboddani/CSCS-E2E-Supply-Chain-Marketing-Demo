import type { ActivityEntityType, DemoScenario } from "./types";

const getEntityIds = (scenario: DemoScenario, entityType: ActivityEntityType): string[] => {
  switch (entityType) {
    case "DemandForecast":
      return scenario.forecasts.map((entity) => entity.id);
    case "PurchaseOrder":
      return scenario.purchaseOrders.map((entity) => entity.id);
    case "GoodsReceipt":
      return scenario.goodsReceipts.map((entity) => entity.id);
    case "GoodsReceiptLine":
      return scenario.goodsReceiptLines.map((entity) => entity.id);
    case "InventoryBalance":
      return scenario.inventory.map((entity) => entity.id);
    case "SalesOrder":
      return scenario.salesOrders.map((entity) => entity.id);
    case "PickTask":
      return scenario.pickTasks.map((entity) => entity.id);
    case "PackTask":
      return scenario.packTasks.map((entity) => entity.id);
    case "Shipment":
      return scenario.shipments.map((entity) => entity.id);
  }
};

export const getScenarioInvariantViolations = (scenario: DemoScenario): string[] => {
  const violations: string[] = [];

  for (const balance of scenario.inventory) {
    if (balance.onHand < 0) violations.push(balance.sku + ": onHand is negative");
    if (balance.reserved < 0) violations.push(balance.sku + ": reserved is negative");
    if (balance.reserved > balance.onHand) violations.push(balance.sku + ": reserved exceeds onHand");
  }

  for (const balance of scenario.inventory) {
    const activeReservationQty = scenario.reservations
      .filter((reservation) => reservation.sku === balance.sku && reservation.status === "ACTIVE")
      .reduce((total, reservation) => total + reservation.quantity, 0);
    if (activeReservationQty !== balance.reserved) {
      violations.push(balance.sku + ": active reservations do not match reserved inventory");
    }
  }

  const ids = new Set<string>();
  for (const collection of [
    scenario.products,
    scenario.suppliers,
    scenario.warehouses,
    scenario.locations,
    scenario.forecasts,
    scenario.purchaseOrders,
    scenario.purchaseOrderLines,
    scenario.goodsReceipts,
    scenario.goodsReceiptLines,
    scenario.inventory,
    scenario.customers,
    scenario.salesOrders,
    scenario.salesOrderLines,
    scenario.reservations,
    scenario.pickTasks,
    scenario.packTasks,
    scenario.carriers,
    scenario.shipments,
    scenario.trackingEvents,
    scenario.activityEvents,
  ]) {
    for (const entity of collection) {
      if (ids.has(entity.id)) violations.push("Duplicate entity ID: " + entity.id);
      ids.add(entity.id);
    }
  }

  for (let index = 1; index < scenario.activityEvents.length; index += 1) {
    if (scenario.activityEvents[index - 1]!.timestamp > scenario.activityEvents[index]!.timestamp) {
      violations.push("Activity events are not chronological");
      break;
    }
  }

  for (const event of scenario.activityEvents) {
    if (!getEntityIds(scenario, event.entityType).includes(event.entityId)) {
      violations.push("Unresolved " + event.entityType + " reference: " + event.entityId);
    }
  }

  for (const receipt of scenario.goodsReceipts) {
    if (!scenario.purchaseOrders.some((order) => order.id === receipt.poId)) {
      violations.push("Unresolved purchase order reference: " + receipt.poId);
    }
  }
  for (const line of scenario.goodsReceiptLines) {
    if (!scenario.goodsReceipts.some((receipt) => receipt.id === line.receiptId)) {
      violations.push("Unresolved receipt reference: " + line.receiptId);
    }
    if (!scenario.locations.some((location) => location.id === line.locationId)) {
      violations.push("Unresolved warehouse location reference: " + line.locationId);
    }
  }
  for (const shipment of scenario.shipments) {
    if (!scenario.salesOrders.some((order) => order.id === shipment.orderId)) {
      violations.push("Unresolved sales order reference: " + shipment.orderId);
    }
  }

  return violations;
};

export const assertScenarioInvariants = (scenario: DemoScenario): void => {
  const violations = getScenarioInvariantViolations(scenario);
  if (violations.length > 0) {
    throw new Error("Scenario invariant failed: " + violations.join("; "));
  }
};
