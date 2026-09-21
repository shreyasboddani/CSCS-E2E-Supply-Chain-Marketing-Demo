import type { StageId } from "../domain/types";

export interface StageDefinition {
  id: StageId;
  label: string;
  shortLabel: string;
  path: string;
  eyebrow: string;
  purpose: string;
  whatHappened: string;
  whyItMatters: string;
  nextConnection: string;
}

export const stageDefinitions: StageDefinition[] = [
  {
    id: "intro",
    label: "Introduction",
    shortLabel: "Intro",
    path: "/intro",
    eyebrow: "THE CONNECTED SCOTI™ STORY",
    purpose: "One promotion. One promise. A connected supply chain concept, from plan to delivery.",
    whatHappened: "A Back-to-School promotion is expected to lift demand for Everyday 600 bottles.",
    whyItMatters: "Planning, inventory, warehouse execution, and delivery all affect the same customer promise.",
    nextConnection: "Start with the demand signal behind the 100-unit replenishment requirement.",
  },
  {
    id: "demand",
    label: "Demand Planning",
    shortLabel: "Demand",
    path: "/demand",
    eyebrow: "01 / PLAN",
    purpose: "Turn a promotion forecast into a clear replenishment requirement.",
    whatHappened: "The product forecast is compared with available stock and its target ending quantity.",
    whyItMatters: "The gap is visible before the promotion begins, while there is still time to replenish.",
    nextConnection: "The 100-unit requirement becomes a traceable purchase commitment.",
  },
  {
    id: "sourcing",
    label: "Sourcing",
    shortLabel: "Sourcing",
    path: "/sourcing",
    eyebrow: "02 / COMMIT",
    purpose: "Connect the demand decision to an incoming supplier commitment.",
    whatHappened: "The purchase order links the replenishment requirement to an incoming supplier commitment.",
    whyItMatters: "The planned replenishment can be followed into the receiving operation.",
    nextConnection: "The expected purchase order becomes receipt RCPT-1001 at the warehouse.",
  },
  {
    id: "inbound",
    label: "Inbound & Warehouse",
    shortLabel: "Inbound",
    path: "/inbound",
    eyebrow: "03 / RECEIVE",
    purpose: "Show how an inbound receipt changes the inventory picture.",
    whatHappened: "The goods receipt links the supplier delivery to a warehouse put-away location.",
    whyItMatters: "A receipt is connected to the inventory balance downstream teams use.",
    nextConnection: "The same TS-600 balance is available to support customer orders.",
  },
  {
    id: "orders",
    label: "Order Management",
    shortLabel: "Orders",
    path: "/orders",
    eyebrow: "04 / COMMIT",
    purpose: "Connect a customer promise to the inventory position behind it.",
    whatHappened: "The sales order connects a customer commitment to a product and quantity.",
    whyItMatters: "The order becomes visible alongside on-hand, reserved, and available units.",
    nextConnection: "The order data provides the pick and pack work for the warehouse.",
  },
  {
    id: "fulfillment",
    label: "Fulfillment",
    shortLabel: "Fulfillment",
    path: "/fulfillment",
    eyebrow: "05 / EXECUTE",
    purpose: "Follow the order into a concrete warehouse pick and pack task.",
    whatHappened: "A pick task and pack task connect warehouse work to the customer order.",
    whyItMatters: "Warehouse execution stays linked to the order and its reserved inventory.",
    nextConnection: "A packed order is ready to move into shipment execution.",
  },
  {
    id: "shipment",
    label: "Shipment & Delivery",
    shortLabel: "Shipment",
    path: "/shipment",
    eyebrow: "06 / DELIVER",
    purpose: "Carry the delivery promise beyond the warehouse.",
    whatHappened: "The shipment connects the packed order to carrier milestones.",
    whyItMatters: "Dispatch, transit, and delivery remain connected to the customer order.",
    nextConnection: "The final view brings the operational events together in one timeline.",
  },
  {
    id: "control-tower",
    label: "Control Tower",
    shortLabel: "Control Tower",
    path: "/control-tower",
    eyebrow: "07 / CONNECT",
    purpose: "See the hero entities and activity as one connected operational story.",
    whatHappened: "The timeline brings planning, purchase, receipt, order, warehouse, and shipment events together.",
    whyItMatters: "A shared view makes the connections between operational decisions easier to follow.",
    nextConnection: "Reset the scenario to begin the guided journey again.",
  },
];

export const getStageDefinition = (stageId: StageId): StageDefinition =>
  stageDefinitions.find((stage) => stage.id === stageId) ?? stageDefinitions[0]!;

export const getNextStage = (stageId: StageId): StageDefinition | undefined => {
  const index = stageDefinitions.findIndex((stage) => stage.id === stageId);
  return stageDefinitions[index + 1];
};
