import type { DemoScenario } from "./types";
import {
  calculateReplenishmentRequirement,
  getAvailableInventory,
  getHeroForecast,
  getHeroInventory,
  getHeroOrder,
  getHeroPurchaseOrder,
  getHeroGoodsReceipt,
  getHeroShipment,
} from "./selectors";

export type DemoAction =
  | "approveReplenishment"
  | "confirmPurchaseOrder"
  | "receivePurchaseOrder"
  | "allocateSalesOrder"
  | "startFulfillment"
  | "completeFulfillment"
  | "dispatchShipment"
  | "advanceShipment";

export function getPresentation(scenario: DemoScenario) {
  const inventory = getHeroInventory(scenario)!;
  const forecast = getHeroForecast(scenario)!;
  const order = getHeroOrder(scenario)!;
  const po = getHeroPurchaseOrder(scenario)!;
  const receipt = getHeroGoodsReceipt(scenario)!;
  const shipment = getHeroShipment(scenario)!;
  const receiptLine = scenario.goodsReceiptLines.find(
    (line) => line.receiptId === receipt.id,
  )!;
  const location = scenario.locations.find(
    (item) => item.id === receiptLine.locationId,
  )!;
  const steps: {
    action: DemoAction;
    label: string;
    description: string;
    done: boolean;
    module: string;
  }[] = [
    {
      action: "approveReplenishment",
      label: "Approve replenishment",
      description: "Connect the forecast to a replenishment decision.",
      done: scenario.metadata.replenishmentApproved,
      module: "demand",
    },
    {
      action: "confirmPurchaseOrder",
      label: "Confirm purchase order",
      description: "Release the supplier commitment into the inbound journey.",
      done: po.status !== "DRAFT",
      module: "sourcing",
    },
    {
      action: "receivePurchaseOrder",
      label: "Receive inventory",
      description: "Post the receipt and update the shared stock position.",
      done: receipt.status === "POSTED",
      module: "inbound",
    },
    {
      action: "allocateSalesOrder",
      label: "Allocate the order",
      description: "Reserve the customer’s units from available inventory.",
      done: order.status !== "NEW",
      module: "orders",
    },
    {
      action: "startFulfillment",
      label: "Start picking",
      description: "Begin the warehouse task for the customer order.",
      done: scenario.pickTasks[0]?.status !== "NOT_STARTED",
      module: "fulfillment",
    },
    {
      action: "completeFulfillment",
      label: "Complete pick & pack",
      description: "Pack the picked units into the linked shipment package.",
      done: scenario.packTasks[0]?.status === "COMPLETE",
      module: "fulfillment",
    },
    {
      action: "dispatchShipment",
      label: "Dispatch shipment",
      description:
        "Release the reservation and move the package out of the warehouse.",
      done: shipment.status !== "PLANNED",
      module: "shipment",
    },
    {
      action: "advanceShipment",
      label: "Advance to in transit",
      description: "Record the next simulated carrier event.",
      done: ["IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"].includes(
        shipment.status,
      ),
      module: "shipment",
    },
    {
      action: "advanceShipment",
      label: "Advance to out for delivery",
      description: "Connect the final delivery leg to the customer promise.",
      done: ["OUT_FOR_DELIVERY", "DELIVERED"].includes(shipment.status),
      module: "shipment",
    },
    {
      action: "advanceShipment",
      label: "Confirm delivery",
      description: "Complete the shipment and customer order together.",
      done: shipment.status === "DELIVERED",
      module: "shipment",
    },
  ];
  return {
    inventory,
    forecast,
    order,
    po,
    receipt,
    shipment,
    location,
    available: getAvailableInventory(inventory),
    requirement: calculateReplenishmentRequirement(forecast, inventory),
    incoming: receiptLine.quantity,
    received: receipt.status === "POSTED",
    shipmentProgress:
      [
        "PLANNED",
        "DISPATCHED",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
      ].indexOf(shipment.status) / 4,
    next: steps.find((step) => !step.done),
    completed: steps.filter((step) => step.done).length,
    total: steps.length,
  };
}
