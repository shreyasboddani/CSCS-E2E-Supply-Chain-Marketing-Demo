import seedScenario from "../data/scenario.json";
import {
  calculateReplenishmentRequirement,
  getHeroForecast,
  getHeroInventory,
  getHeroOrder,
  getHeroPurchaseOrder,
  getHeroShipment,
} from "./selectors";
import { assertScenarioInvariants } from "./invariants";
import type {
  ActivityEntityType,
  ActivityEventType,
  ActivityStage,
  DemoScenario,
  ShipmentStatus,
} from "./types";

export const cloneScenario = (scenario: DemoScenario): DemoScenario =>
  JSON.parse(JSON.stringify(scenario)) as DemoScenario;

const commit = (scenario: DemoScenario): DemoScenario => {
  assertScenarioInvariants(scenario);
  return scenario;
};

const addActivity = (
  scenario: DemoScenario,
  input: {
    stage: ActivityStage;
    entityType: ActivityEntityType;
    entityId: string;
    type: ActivityEventType;
    timestamp: string;
    message: string;
  },
): void => {
  scenario.activityEvents.push({
    id: "EVT-" + String(scenario.activityEvents.length + 1).padStart(3, "0"),
    stage: input.stage,
    entityType: input.entityType,
    entityId: input.entityId,
    type: input.type,
    timestamp: input.timestamp,
    message: input.message,
  });
};

export const approveReplenishment = (current: DemoScenario): DemoScenario => {
  if (current.metadata.replenishmentApproved) return current;
  const forecast = getHeroForecast(current);
  const inventory = getHeroInventory(current);
  if (!forecast || !inventory) return current;
  const requirement = calculateReplenishmentRequirement(forecast, inventory);
  if (requirement === 0) return current;
  const next = cloneScenario(current);
  next.metadata.replenishmentApproved = true;
  addActivity(next, {
    stage: "demand",
    entityType: "DemandForecast",
    entityId: forecast.id,
    type: "DEMAND_REQUIREMENT_APPROVED",
    timestamp: next.metadata.timeline.demandReviewedAt,
    message: "Approved a " + requirement + "-unit replenishment requirement for " + forecast.sku + ".",
  });
  return commit(next);
};

export const confirmPurchaseOrder = (current: DemoScenario): DemoScenario => {
  const purchaseOrder = getHeroPurchaseOrder(current);
  if (!current.metadata.replenishmentApproved || purchaseOrder?.status !== "DRAFT") return current;
  const next = cloneScenario(current);
  next.purchaseOrders = next.purchaseOrders.map((order) =>
    order.id === purchaseOrder.id ? { ...order, status: "CONFIRMED" } : order,
  );
  addActivity(next, {
    stage: "sourcing",
    entityType: "PurchaseOrder",
    entityId: purchaseOrder.id,
    type: "PO_CONFIRMED",
    timestamp: next.metadata.timeline.purchaseOrderConfirmedAt,
    message: purchaseOrder.id + " confirmed with " + (next.suppliers.find((supplier) => supplier.id === purchaseOrder.supplierId)?.name ?? "supplier") + ".",
  });
  return commit(next);
};

export const receivePurchaseOrder = (current: DemoScenario): DemoScenario => {
  const purchaseOrder = getHeroPurchaseOrder(current);
  const receipt = current.goodsReceipts.find((item) => item.id === current.metadata.heroGoodsReceiptId);
  if (purchaseOrder?.status !== "CONFIRMED" || receipt?.status !== "EXPECTED") return current;
  const receiptLines = current.goodsReceiptLines.filter((line) => line.receiptId === receipt.id);
  if (receiptLines.length === 0) return current;

  const next = cloneScenario(current);
  next.purchaseOrders = next.purchaseOrders.map((order) =>
    order.id === purchaseOrder.id ? { ...order, status: "RECEIVED" } : order,
  );
  next.goodsReceipts = next.goodsReceipts.map((item) =>
    item.id === receipt.id ? { ...item, status: "POSTED", receivedAt: next.metadata.timeline.receiptPostedAt } : item,
  );
  for (const line of receiptLines) {
    const balance = next.inventory.find((item) => item.sku === line.sku);
    if (!balance) return current;
    balance.onHand += line.quantity;
  }
  addActivity(next, {
    stage: "inbound",
    entityType: "GoodsReceipt",
    entityId: receipt.id,
    type: "RECEIPT_POSTED",
    timestamp: next.metadata.timeline.receiptPostedAt,
    message: receipt.id + " posted at location " + (next.locations.find((location) => location.id === receiptLines[0]!.locationId)?.code ?? "the warehouse") + ".",
  });
  addActivity(next, {
    stage: "inbound",
    entityType: "GoodsReceiptLine",
    entityId: receiptLines[0]!.id,
    type: "INVENTORY_INCREASED",
    timestamp: next.metadata.timeline.receiptPostedAt,
    message: receiptLines[0]!.sku + " on-hand inventory increased by " + receiptLines[0]!.quantity + " units.",
  });
  return commit(next);
};

export const allocateSalesOrder = (current: DemoScenario): DemoScenario => {
  const order = getHeroOrder(current);
  const shipment = getHeroShipment(current);
  const line = current.salesOrderLines.find((item) => item.orderId === current.metadata.heroOrderId);
  const balance = getHeroInventory(current);
  const receipt = current.goodsReceipts.find((item) => item.id === current.metadata.heroGoodsReceiptId);
  if (order?.status !== "NEW" || shipment?.status !== "PLANNED" || receipt?.status !== "POSTED" || !line || !balance) {
    return current;
  }
  if (balance.onHand - balance.reserved < line.quantity) return current;

  const next = cloneScenario(current);
  const nextBalance = next.inventory.find((item) => item.id === balance.id)!;
  nextBalance.reserved += line.quantity;
  next.salesOrders = next.salesOrders.map((item) =>
    item.id === order.id ? { ...item, status: "ALLOCATED" } : item,
  );
  next.reservations.push({
    id: "RES-1001",
    orderId: order.id,
    sku: line.sku,
    quantity: line.quantity,
    status: "ACTIVE",
  });
  addActivity(next, {
    stage: "orders",
    entityType: "SalesOrder",
    entityId: order.id,
    type: "ORDER_ALLOCATED",
    timestamp: next.metadata.timeline.salesOrderPlacedAt,
    message: order.id + " allocated " + line.quantity + " " + line.sku + " units; available inventory is " + (nextBalance.onHand - nextBalance.reserved) + ".",
  });
  return commit(next);
};

export const startFulfillment = (current: DemoScenario): DemoScenario => {
  const order = getHeroOrder(current);
  const pick = current.pickTasks.find((task) => task.orderId === current.metadata.heroOrderId);
  if (order?.status !== "ALLOCATED" || pick?.status !== "NOT_STARTED") return current;
  const next = cloneScenario(current);
  next.salesOrders = next.salesOrders.map((item) =>
    item.id === order.id ? { ...item, status: "PICKING" } : item,
  );
  next.pickTasks = next.pickTasks.map((task) =>
    task.id === pick.id ? { ...task, status: "IN_PROGRESS" } : task,
  );
  addActivity(next, {
    stage: "fulfillment",
    entityType: "PickTask",
    entityId: pick.id,
    type: "PICK_STARTED",
    timestamp: next.metadata.timeline.pickStartedAt,
    message: "Picking started for " + order.id + " at location " + (next.locations.find((location) => location.id === pick.locationId)?.code ?? "the warehouse") + ".",
  });
  return commit(next);
};

export const completeFulfillment = (current: DemoScenario): DemoScenario => {
  const order = getHeroOrder(current);
  const pick = current.pickTasks.find((task) => task.orderId === current.metadata.heroOrderId);
  const pack = current.packTasks.find((task) => task.orderId === current.metadata.heroOrderId);
  if (order?.status !== "PICKING" || pick?.status !== "IN_PROGRESS" || pack?.status !== "WAITING") return current;
  const next = cloneScenario(current);
  next.pickTasks = next.pickTasks.map((task) =>
    task.id === pick.id ? { ...task, pickedQty: task.requiredQty, status: "COMPLETE" } : task,
  );
  next.packTasks = next.packTasks.map((task) =>
    task.id === pack.id ? { ...task, status: "COMPLETE" } : task,
  );
  next.salesOrders = next.salesOrders.map((item) =>
    item.id === order.id ? { ...item, status: "PACKED" } : item,
  );
  addActivity(next, {
    stage: "fulfillment",
    entityType: "PickTask",
    entityId: pick.id,
    type: "PICK_COMPLETED",
    timestamp: next.metadata.timeline.pickCompletedAt,
    message: pick.requiredQty + " " + pick.sku + " units picked for " + order.id + ".",
  });
  addActivity(next, {
    stage: "fulfillment",
    entityType: "PackTask",
    entityId: pack.id,
    type: "PACK_COMPLETED",
    timestamp: next.metadata.timeline.packCompletedAt,
    message: order.id + " packed into " + pack.packageId + ".",
  });
  return commit(next);
};

export const dispatchShipment = (current: DemoScenario): DemoScenario => {
  const order = getHeroOrder(current);
  const shipment = getHeroShipment(current);
  const reservation = current.reservations.find(
    (item) => item.orderId === current.metadata.heroOrderId && item.status === "ACTIVE",
  );
  const balance = getHeroInventory(current);
  if (order?.status !== "PACKED" || shipment?.status !== "PLANNED" || !reservation || !balance) return current;
  if (balance.onHand < reservation.quantity || balance.reserved < reservation.quantity) return current;

  const next = cloneScenario(current);
  const nextBalance = next.inventory.find((item) => item.id === balance.id)!;
  nextBalance.onHand -= reservation.quantity;
  nextBalance.reserved -= reservation.quantity;
  next.reservations = next.reservations.map((item) =>
    item.id === reservation.id ? { ...item, status: "RELEASED" } : item,
  );
  next.salesOrders = next.salesOrders.map((item) =>
    item.id === order.id ? { ...item, status: "SHIPPED" } : item,
  );
  next.shipments = next.shipments.map((item) =>
    item.id === shipment.id
      ? { ...item, status: "DISPATCHED", dispatchAt: next.metadata.timeline.shipmentDispatchedAt }
      : item,
  );
  next.trackingEvents.push({
    id: "TRK-" + String(next.trackingEvents.length + 1001).padStart(4, "0"),
    shipmentId: shipment.id,
    type: "DISPATCHED",
    timestamp: next.metadata.timeline.shipmentDispatchedAt,
    locationLabel: next.warehouses.find((warehouse) => warehouse.id === nextBalance.warehouseId)?.name ?? "Warehouse",
    message: "Shipment dispatched from the warehouse.",
  });
  addActivity(next, {
    stage: "shipment",
    entityType: "Shipment",
    entityId: shipment.id,
    type: "SHIPMENT_DISPATCHED",
    timestamp: next.metadata.timeline.shipmentDispatchedAt,
    message: shipment.id + " dispatched; on-hand inventory is now " + nextBalance.onHand + " units.",
  });
  return commit(next);
};

export const advanceShipment = (current: DemoScenario, expectedStatus: ShipmentStatus): DemoScenario => {
  const shipment = getHeroShipment(current);
  if (!shipment || shipment.status !== expectedStatus) return current;
  const nextStep = {
    DISPATCHED: {
      status: "IN_TRANSIT",
      timestamp: current.metadata.timeline.shipmentInTransitAt,
      locationLabel: "Regional sort facility",
      message: "Shipment is in transit to the destination region.",
      eventType: "SHIPMENT_IN_TRANSIT",
    },
    IN_TRANSIT: {
      status: "OUT_FOR_DELIVERY",
      timestamp: current.metadata.timeline.shipmentOutForDeliveryAt,
      locationLabel: "Destination delivery route",
      message: "Shipment is out for delivery.",
      eventType: "SHIPMENT_OUT_FOR_DELIVERY",
    },
    OUT_FOR_DELIVERY: {
      status: "DELIVERED",
      timestamp: current.metadata.timeline.shipmentDeliveredAt,
      locationLabel: "Alex Morgan delivery address",
      message: "Shipment delivered to " + (current.customers.find((customer) => customer.id === getHeroOrder(current)?.customerId)?.name ?? "the customer") + ".",
      eventType: "SHIPMENT_DELIVERED",
    },
  } as const;
  if (shipment.status === "PLANNED" || shipment.status === "DELIVERED") return current;
  const step = nextStep[shipment.status];
  const next = cloneScenario(current);
  next.shipments = next.shipments.map((item) =>
    item.id === shipment.id
      ? {
          ...item,
          status: step.status,
          deliveryAt: step.status === "DELIVERED" ? step.timestamp : item.deliveryAt,
        }
      : item,
  );
  if (step.status === "DELIVERED") {
    next.salesOrders = next.salesOrders.map((order) =>
      order.id === shipment.orderId ? { ...order, status: "DELIVERED" } : order,
    );
  }
  next.trackingEvents.push({
    id: "TRK-" + String(next.trackingEvents.length + 1001).padStart(4, "0"),
    shipmentId: shipment.id,
    type: step.status,
    timestamp: step.timestamp,
    locationLabel: step.locationLabel,
    message: step.message,
  });
  addActivity(next, {
    stage: "shipment",
    entityType: "Shipment",
    entityId: shipment.id,
    type: step.eventType,
    timestamp: step.timestamp,
    message: step.message,
  });
  return commit(next);
};

export const resetScenario = (): DemoScenario => {
  const scenario = cloneScenario(seedScenario as DemoScenario);
  return commit(scenario);
};
