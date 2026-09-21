import type {
  ActivityEvent,
  DemoScenario,
  DemandForecast,
  InventoryBalance,
  StageId,
} from "./types";

export const getAvailableInventory = (balance: InventoryBalance): number =>
  balance.onHand - balance.reserved;

export const calculateReplenishmentRequirement = (
  forecast: DemandForecast,
  balance: InventoryBalance,
): number => Math.max(0, forecast.forecastQty + forecast.targetEndingQty - getAvailableInventory(balance));

export const getProductInventory = (
  scenario: DemoScenario,
  sku: string,
): InventoryBalance | undefined => scenario.inventory.find((balance) => balance.sku === sku);

export const getProductForecast = (
  scenario: DemoScenario,
  sku: string,
): DemandForecast | undefined => scenario.forecasts.find((forecast) => forecast.sku === sku);

export const getHeroInventory = (scenario: DemoScenario): InventoryBalance | undefined =>
  getProductInventory(scenario, scenario.metadata.heroSku);

export const getHeroForecast = (scenario: DemoScenario): DemandForecast | undefined =>
  getProductForecast(scenario, scenario.metadata.heroSku);

export const getHeroOrder = (scenario: DemoScenario) =>
  scenario.salesOrders.find((order) => order.id === scenario.metadata.heroOrderId);

export const getHeroPurchaseOrder = (scenario: DemoScenario) =>
  scenario.purchaseOrders.find((order) => order.id === scenario.metadata.heroPurchaseOrderId);

export const getHeroGoodsReceipt = (scenario: DemoScenario) =>
  scenario.goodsReceipts.find((receipt) => receipt.id === scenario.metadata.heroGoodsReceiptId);

export const getHeroShipment = (scenario: DemoScenario) =>
  scenario.shipments.find((shipment) => shipment.id === scenario.metadata.heroShipmentId);

export const getActivityTimeline = (scenario: DemoScenario): ActivityEvent[] =>
  [...scenario.activityEvents].sort((left, right) => left.timestamp.localeCompare(right.timestamp));

export const getCurrentScenarioDate = (scenario: DemoScenario): string =>
  getActivityTimeline(scenario).at(-1)?.timestamp.slice(0, 10) ?? scenario.metadata.scenarioDate;

export const getJourneyProgress = (scenario: DemoScenario): { currentStage: StageId; completedStages: StageId[] } => {
  const completedStages: StageId[] = ["intro"];
  let currentStage: StageId = "demand";
  const purchaseOrder = getHeroPurchaseOrder(scenario);
  const receipt = getHeroGoodsReceipt(scenario);
  const order = getHeroOrder(scenario);
  const shipment = getHeroShipment(scenario);

  if (scenario.metadata.replenishmentApproved) {
    completedStages.push("demand");
    currentStage = "sourcing";
  }
  if (purchaseOrder?.status === "CONFIRMED" || purchaseOrder?.status === "RECEIVED") {
    completedStages.push("sourcing");
    currentStage = "inbound";
  }
  if (receipt?.status === "POSTED") {
    completedStages.push("inbound");
    currentStage = "orders";
  }
  if (order && order.status !== "NEW") {
    completedStages.push("orders");
    currentStage = "fulfillment";
  }
  if (order && ["PACKED", "SHIPPED", "DELIVERED"].includes(order.status)) {
    completedStages.push("fulfillment");
    currentStage = "shipment";
  }
  if (shipment && shipment.status !== "PLANNED") {
    completedStages.push("shipment");
    currentStage = shipment.status === "DELIVERED" ? "control-tower" : "shipment";
  }
  if (shipment?.status === "DELIVERED") {
    completedStages.push("control-tower");
  }

  return { currentStage, completedStages };
};

export const getHeroOrderQuantity = (scenario: DemoScenario): number =>
  scenario.salesOrderLines
    .filter((line) => line.orderId === scenario.metadata.heroOrderId)
    .reduce((total, line) => total + line.quantity, 0);
