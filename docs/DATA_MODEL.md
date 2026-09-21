# Data model

The canonical JSON seed is src/data/scenario.json. Type definitions live in src/domain/types.ts. React components select data through src/domain/selectors.ts; only guarded pure functions in src/domain/transitions.ts change business state.

## Entities and fields

All entity identifiers are stable strings. Timestamps use ISO 8601 UTC. Quantity values are whole units.

| Entity | Fields |
| --- | --- |
| Product | id, sku, name, sizeMl, active |
| Supplier | id, name, fictional |
| Warehouse | id, name |
| WarehouseLocation | id, warehouseId, code, zone |
| DemandForecast | id, sku, periodStart, periodEnd, forecastQty, targetEndingQty |
| PurchaseOrder | id, supplierId, status, orderedAt, expectedAt, sourceForecastId |
| PurchaseOrderLine | id, poId, sku, quantity |
| GoodsReceipt | id, poId, status, receivedAt |
| GoodsReceiptLine | id, receiptId, sku, quantity, locationId |
| InventoryBalance | id, warehouseId, sku, onHand, reserved |
| Customer | id, name, fictional |
| SalesOrder | id, customerId, status, placedAt, promisedBy |
| SalesOrderLine | id, orderId, sku, quantity |
| Reservation | id, orderId, sku, quantity, status |
| PickTask | id, orderId, sku, locationId, requiredQty, pickedQty, status |
| PackTask | id, orderId, packageId, status |
| Carrier | id, name, fictional |
| Shipment | id, orderId, carrierId, status, dispatchAt, deliveryAt, packageId |
| TrackingEvent | id, shipmentId, type, timestamp, locationLabel, message |
| ActivityEvent | id, stage, entityType, entityId, type, timestamp, message |
| ScenarioMetadata | id, name, company, description, fictional, scenarioDate, promotionDate, heroSku, heroOrderId, heroPurchaseOrderId, heroGoodsReceiptId, heroShipmentId, replenishmentApproved, timeline |
| ScenarioTimeline | demandReviewedAt, purchaseOrderConfirmedAt, receiptPostedAt, salesOrderPlacedAt, pickStartedAt, pickCompletedAt, packCompletedAt, shipmentDispatchedAt, shipmentInTransitAt, shipmentOutForDeliveryAt, shipmentDeliveredAt |

## Relationships

- Each forecast and inventory balance belongs to a product SKU.
- PO-1001 references ClearPeak Manufacturing and forecast FC-TS600-BTS. Its line references TS-600.
- RCPT-1001 references PO-1001. Its receipt line references TS-600 and location A-03-02.
- ORD-1001 references Alex Morgan. Its line references TS-600.
- Reservations and pick/pack tasks reference ORD-1001. The pick task references A-03-02; the pack task references PKG-1001.
- SHP-1001 references ORD-1001 and SwiftLine Parcel. Tracking events reference SHP-1001.
- Activity events reference the entity that caused the event. Their entity type and ID must resolve in the current scenario.

## Status values

Purchase order: DRAFT → CONFIRMED → RECEIVED. Receipt: EXPECTED → POSTED. Sales order: NEW → ALLOCATED → PICKING → PACKED → SHIPPED → DELIVERED. Reservation: ACTIVE → RELEASED. Pick: NOT_STARTED → IN_PROGRESS → COMPLETE. Pack: WAITING → COMPLETE. Shipment: PLANNED → DISPATCHED → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED.

## Derived values and invariants

- Available inventory = onHand − reserved; it is never stored independently.
- Replenishment requirement = max(0, forecastQty + targetEndingQty − available).
- Forecast is anticipated demand and remains 120 when ORD-1001 is created.
- Current scenario date is the date of the latest activity event, falling back to the seed metadata date before any activity.
- onHand ≥ 0; reserved ≥ 0; reserved ≤ onHand.
- Receipt, allocation, pick/pack, dispatch, and shipment progression are guarded against duplicate execution. Shipment advancement checks the caller's expected current status so a stale repeated action becomes a safe no-op.
- Initial reservations and tracking/activity events are empty. A reservation is created only when the NEW order is allocated, keeping initial reserved stock at zero.

## Event model

Canonical activity types: DEMAND_REQUIREMENT_APPROVED, PO_CONFIRMED, RECEIPT_POSTED, INVENTORY_INCREASED, ORDER_ALLOCATED, PICK_STARTED, PICK_COMPLETED, PACK_COMPLETED, SHIPMENT_DISPATCHED, SHIPMENT_IN_TRANSIT, SHIPMENT_OUT_FOR_DELIVERY, SHIPMENT_DELIVERED.

Events are appended by domain transitions with timestamps from scenario metadata and stable IDs, then selected in chronological order. The same timeline metadata supplies stage milestone dates. Control Tower presents those events; it does not maintain a second copy of business state.

## Transition ownership

src/domain/transitions.ts owns all state changes. src/domain/selectors.ts derives summaries and progress. src/domain/invariants.ts checks references, status consistency, and stock equations. src/store/demoStore.ts adapts those pure transitions to Zustand and reset restores a clone of the JSON seed.

## Scenario timeline

Demand review Aug 12, 2026; PO confirmation Aug 13; receipt Aug 18; order/pick/pack Aug 19; dispatch Aug 20; delivery Aug 22; promotion Aug 24. See docs/PROJECT_CONTRACT.md for exact locked quantities.
