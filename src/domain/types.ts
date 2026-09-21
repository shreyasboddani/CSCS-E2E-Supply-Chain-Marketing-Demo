export type PurchaseOrderStatus = "DRAFT" | "CONFIRMED" | "RECEIVED";
export type GoodsReceiptStatus = "EXPECTED" | "POSTED";
export type SalesOrderStatus = "NEW" | "ALLOCATED" | "PICKING" | "PACKED" | "SHIPPED" | "DELIVERED";
export type ReservationStatus = "ACTIVE" | "RELEASED";
export type PickTaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
export type PackTaskStatus = "WAITING" | "COMPLETE";
export type ShipmentStatus = "PLANNED" | "DISPATCHED" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED";

export type ActivityEventType =
  | "DEMAND_REQUIREMENT_APPROVED"
  | "PO_CONFIRMED"
  | "RECEIPT_POSTED"
  | "INVENTORY_INCREASED"
  | "ORDER_ALLOCATED"
  | "PICK_STARTED"
  | "PICK_COMPLETED"
  | "PACK_COMPLETED"
  | "SHIPMENT_DISPATCHED"
  | "SHIPMENT_IN_TRANSIT"
  | "SHIPMENT_OUT_FOR_DELIVERY"
  | "SHIPMENT_DELIVERED";

export type ActivityStage =
  | "demand"
  | "sourcing"
  | "inbound"
  | "orders"
  | "fulfillment"
  | "shipment"
  | "control-tower";

export type ActivityEntityType =
  | "DemandForecast"
  | "PurchaseOrder"
  | "GoodsReceipt"
  | "GoodsReceiptLine"
  | "InventoryBalance"
  | "SalesOrder"
  | "PickTask"
  | "PackTask"
  | "Shipment";

export interface Product {
  id: string;
  sku: string;
  name: string;
  sizeMl: number;
  active: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  fictional: boolean;
}

export interface Warehouse {
  id: string;
  name: string;
}

export interface WarehouseLocation {
  id: string;
  warehouseId: string;
  code: string;
  zone: string;
}

export interface DemandForecast {
  id: string;
  sku: string;
  periodStart: string;
  periodEnd: string;
  forecastQty: number;
  targetEndingQty: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  status: PurchaseOrderStatus;
  orderedAt: string;
  expectedAt: string;
  sourceForecastId: string;
}

export interface PurchaseOrderLine {
  id: string;
  poId: string;
  sku: string;
  quantity: number;
}

export interface GoodsReceipt {
  id: string;
  poId: string;
  status: GoodsReceiptStatus;
  receivedAt: string | null;
}

export interface GoodsReceiptLine {
  id: string;
  receiptId: string;
  sku: string;
  quantity: number;
  locationId: string;
}

export interface InventoryBalance {
  id: string;
  warehouseId: string;
  sku: string;
  onHand: number;
  reserved: number;
}

export interface Customer {
  id: string;
  name: string;
  fictional: boolean;
}

export interface SalesOrder {
  id: string;
  customerId: string;
  status: SalesOrderStatus;
  placedAt: string;
  promisedBy: string;
}

export interface SalesOrderLine {
  id: string;
  orderId: string;
  sku: string;
  quantity: number;
}

export interface Reservation {
  id: string;
  orderId: string;
  sku: string;
  quantity: number;
  status: ReservationStatus;
}

export interface PickTask {
  id: string;
  orderId: string;
  sku: string;
  locationId: string;
  requiredQty: number;
  pickedQty: number;
  status: PickTaskStatus;
}

export interface PackTask {
  id: string;
  orderId: string;
  packageId: string;
  status: PackTaskStatus;
}

export interface Carrier {
  id: string;
  name: string;
  fictional: boolean;
}

export interface Shipment {
  id: string;
  orderId: string;
  carrierId: string;
  status: ShipmentStatus;
  dispatchAt: string | null;
  deliveryAt: string | null;
  packageId: string;
}

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  type: Exclude<ShipmentStatus, "PLANNED">;
  timestamp: string;
  locationLabel: string;
  message: string;
}

export interface ActivityEvent {
  id: string;
  stage: ActivityStage;
  entityType: ActivityEntityType;
  entityId: string;
  type: ActivityEventType;
  timestamp: string;
  message: string;
}

export interface ScenarioMetadata {
  id: string;
  name: string;
  company: string;
  description: string;
  fictional: boolean;
  scenarioDate: string;
  promotionDate: string;
  heroSku: string;
  heroOrderId: string;
  heroPurchaseOrderId: string;
  heroGoodsReceiptId: string;
  heroShipmentId: string;
  replenishmentApproved: boolean;
  timeline: ScenarioTimeline;
}

export interface ScenarioTimeline {
  demandReviewedAt: string;
  purchaseOrderConfirmedAt: string;
  receiptPostedAt: string;
  salesOrderPlacedAt: string;
  pickStartedAt: string;
  pickCompletedAt: string;
  packCompletedAt: string;
  shipmentDispatchedAt: string;
  shipmentInTransitAt: string;
  shipmentOutForDeliveryAt: string;
  shipmentDeliveredAt: string;
}

export interface DemoScenario {
  metadata: ScenarioMetadata;
  products: Product[];
  suppliers: Supplier[];
  warehouses: Warehouse[];
  locations: WarehouseLocation[];
  forecasts: DemandForecast[];
  purchaseOrders: PurchaseOrder[];
  purchaseOrderLines: PurchaseOrderLine[];
  goodsReceipts: GoodsReceipt[];
  goodsReceiptLines: GoodsReceiptLine[];
  inventory: InventoryBalance[];
  customers: Customer[];
  salesOrders: SalesOrder[];
  salesOrderLines: SalesOrderLine[];
  reservations: Reservation[];
  pickTasks: PickTask[];
  packTasks: PackTask[];
  carriers: Carrier[];
  shipments: Shipment[];
  trackingEvents: TrackingEvent[];
  activityEvents: ActivityEvent[];
}

export type JourneyMode = "guided" | "explore";
export type StageId = "intro" | ActivityStage;
