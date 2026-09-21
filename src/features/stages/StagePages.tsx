import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { stageDefinitions } from "../../narrative/stageCopy";
import type { StageId } from "../../domain/types";
import { useDemoStore } from "../../store/demoStore";
import {
  calculateReplenishmentRequirement,
  getActivityTimeline,
  getAvailableInventory,
  getCurrentScenarioDate,
  getHeroForecast,
  getHeroGoodsReceipt,
  getHeroInventory,
  getHeroOrder,
  getHeroPurchaseOrder,
  getHeroShipment,
} from "../../domain/selectors";
import { NarrativeRail } from "../../components/narrative/NarrativeRail";
import { Timeline } from "../../components/narrative/Timeline";
import { ConnectedThread } from "../../components/ui/ConnectedThread";
import { StageHeader } from "../../components/ui/StageHeader";
import { StageAction } from "../../components/ui/StageAction";
import { formatCompactDate, formatScenarioDate } from "../../utils/dates";
import {
  Card,
  ChartCard,
  DataTable,
  DataTableCell,
  DataTableHead,
  KpiCard,
  Metric,
  MetricDelta,
  OperationalId,
  SectionHeader,
  StatusBadge,
  Surface,
} from "../../components/ui/primitives";

function StageFrame({ stageId, children }: { stageId: StageId; children: ReactNode }) {
  const scenario = useDemoStore((state) => state.scenario);
  const stageIndex = stageDefinitions.findIndex((stage) => stage.id === stageId);
  const nextStage = stageDefinitions[stageIndex + 1];
  return (
    <div className="stage-layout">
      <main className="stage-main">
        <StageHeader stageId={stageId} />
        <ConnectedThread scenario={scenario} />
        <div className="stage-body">{children}</div>
        {nextStage && (
          <div className="stage-continue">
            <span>Connected next</span>
            <Link to={nextStage.path}>{nextStage.label}<span aria-hidden="true"> →</span></Link>
          </div>
        )}
      </main>
      <NarrativeRail stageId={stageId} scenario={scenario} />
    </div>
  );
}

function ProductDemandTable() {
  const scenario = useDemoStore((state) => state.scenario);
  return (
    <DataTable label="Demand and available inventory by product">
      <DataTableHead>
        <th scope="col">Product / SKU</th>
        <th scope="col" className="table-numeric">Forecast</th>
        <th scope="col" className="table-numeric">Available</th>
        <th scope="col" className="table-numeric">Target</th>
        <th scope="col">Plan</th>
      </DataTableHead>
      <tbody>
        {scenario.products.map((product) => {
          const forecast = scenario.forecasts.find((item) => item.sku === product.sku);
          const balance = scenario.inventory.find((item) => item.sku === product.sku);
          if (!forecast || !balance) return null;
          const requirement = calculateReplenishmentRequirement(forecast, balance);
          return (
            <tr key={product.sku} className={product.sku === scenario.metadata.heroSku ? "hero-row" : undefined}>
              <DataTableCell>
                <strong>{product.name}</strong>
                <span className="table-subline">{product.sku} · {product.sizeMl} ml</span>
              </DataTableCell>
              <DataTableCell numeric>{forecast.forecastQty}</DataTableCell>
              <DataTableCell numeric>{getAvailableInventory(balance)}</DataTableCell>
              <DataTableCell numeric>{forecast.targetEndingQty}</DataTableCell>
              <td>{requirement > 0 ? <span className="replenish-label">Replenish {requirement}</span> : <span className="healthy-label">Within range</span>}</td>
            </tr>
          );
        })}
      </tbody>
    </DataTable>
  );
}

export function IntroPage() {
  const scenario = useDemoStore((state) => state.scenario);
  const forecast = getHeroForecast(scenario);
  const inventory = getHeroInventory(scenario);
  const product = scenario.products.find((item) => item.sku === scenario.metadata.heroSku);
  const supplier = scenario.suppliers[0];
  const warehouse = scenario.warehouses[0];
  const customer = scenario.customers[0];
  const poLine = scenario.purchaseOrderLines.find((item) => item.poId === scenario.metadata.heroPurchaseOrderId);
  const orderLine = scenario.salesOrderLines.find((item) => item.orderId === scenario.metadata.heroOrderId);
  const requirement = forecast && inventory ? calculateReplenishmentRequirement(forecast, inventory) : 0;
  const available = inventory ? getAvailableInventory(inventory) : 0;
  const onHand = inventory?.onHand ?? 0;
  const reserved = inventory?.reserved ?? 0;

  return (
    <StageFrame stageId="intro">
      <section className="intro-hero">
        <div className="intro-copy">
          <span className="overline"><span className="live-marker" /> CSCS · SCOTI™ END-TO-END CONCEPT</span>
          <h2>One supply chain story, from <em>plan to delivery.</em></h2>
          <p>Follow one simulated product through a Back-to-School demand signal, replenishment, warehouse execution, fulfillment, and delivery visibility.</p>
          <div className="intro-actions">
            <Link className="button button--primary" to="/demand">Begin guided journey <span aria-hidden="true">→</span></Link>
            <span className="duration-note">ABOUT 7 MINUTES <span aria-hidden="true">·</span> 8 STAGES</span>
          </div>
        </div>
        <div className="network-visual" aria-label="Supplier to customer supply chain">
          <div className="network-halo" />
          <div className="network-track">
            <div className="network-node"><span className="network-node-icon">01</span><span>SUPPLIER</span><strong>{supplier?.name ?? "—"}</strong></div>
            <div className="network-link"><span>{poLine?.quantity ?? 0} units</span><i /></div>
            <div className="network-node network-node--focus"><span className="network-node-icon">02</span><span>WAREHOUSE</span><strong>{warehouse?.name ?? "—"}</strong></div>
            <div className="network-link"><span>{orderLine?.quantity ?? 0} units</span><i /></div>
            <div className="network-node"><span className="network-node-icon">03</span><span>CUSTOMER</span><strong>{customer?.name ?? "—"}</strong></div>
          </div>
          <div className="network-caption"><span className="signal-dot" /> One scenario thread <span className="caption-separator">/</span> {scenario.metadata.heroSku}</div>
        </div>
      </section>
      <section className="intro-metrics" aria-label="Scenario overview">
        <KpiCard label="Promotion forecast" value={forecast?.forecastQty ?? 0} unit="units" detail={(product?.name ?? "Product") + " · " + scenario.metadata.heroSku} />
        <KpiCard label="Available now" value={available} unit="units" detail={onHand + " on hand · " + reserved + " reserved"} />
        <KpiCard label="Replenishment gap" value={requirement} unit="units" detail="Target ending stock: 20" tone="accent" />
      </section>
      <Card className="intro-journey-card">
        <div>
          <span className="eyebrow">THE CONNECTED JOURNEY</span>
          <h2>One demand signal, carried all the way to delivery.</h2>
        </div>
        <div className="intro-chain">
          <span>Forecast</span><b>→</b><span>Purchase order</span><b>→</b><span>Receipt</span><b>→</b><span>Order</span><b>→</b><span>Delivery</span>
        </div>
      </Card>
    </StageFrame>
  );
}

export function DemandPage() {
  const scenario = useDemoStore((state) => state.scenario);
  const approveReplenishment = useDemoStore((state) => state.approveReplenishment);
  const forecast = getHeroForecast(scenario);
  const balance = getHeroInventory(scenario);
  const available = balance ? getAvailableInventory(balance) : 0;
  const requirement = forecast && balance ? calculateReplenishmentRequirement(forecast, balance) : 0;
  return (
    <StageFrame stageId="demand">
      <div className="kpi-grid kpi-grid--four">
        <KpiCard label="Forecast" value={forecast?.forecastQty ?? 0} unit="units" detail="Back-to-School · TS-600" />
        <KpiCard label="Available" value={available} unit="units" detail="On hand less reserved" />
        <KpiCard label="Target ending" value={forecast?.targetEndingQty ?? 0} unit="units" detail="Planned buffer" />
        <KpiCard label="Requirement" value={requirement} unit="units" detail="Replenishment gap" tone="accent" />
      </div>
      <ChartCard title="Demand and inventory position" description="A shared scenario view across the active product set.">
        <div className="demand-chart">
          <div className="demand-chart-legend"><span><i className="legend-forecast" /> Forecast demand</span><span><i className="legend-inventory" /> Available now</span></div>
          <div className="demand-chart-axis"><span>0</span><span>60</span><span>120 units</span></div>
          {scenario.products.map((product) => {
            const productForecast = scenario.forecasts.find((item) => item.sku === product.sku);
            const productInventory = scenario.inventory.find((item) => item.sku === product.sku);
            if (!productForecast || !productInventory) return null;
            const maximum = Math.max(productForecast.forecastQty, getAvailableInventory(productInventory), 1);
            return (
              <div className="demand-bar-row" key={product.sku}>
                <div className="demand-bar-label"><strong>{product.sku}</strong><span>{product.name}</span></div>
                <div className="demand-bar-track" aria-label={product.sku + ": forecast " + productForecast.forecastQty + ", available " + getAvailableInventory(productInventory)}>
                  <span className="demand-bar demand-bar--forecast" style={{ width: (productForecast.forecastQty / maximum * 100) + "%" }} />
                  <span className="demand-bar demand-bar--inventory" style={{ width: (getAvailableInventory(productInventory) / maximum * 100) + "%" }} />
                </div>
                <span className="demand-bar-value">{productForecast.forecastQty}</span>
              </div>
            );
          })}
          <div className="demand-chart-note"><span className="signal-dot" /> {scenario.metadata.heroSku} needs {requirement} additional units to meet forecast and target.</div>
        </div>
      </ChartCard>
      <Card>
        <SectionHeader title="Product plan" trailing={<span className="table-note">3 SKUs · simulated</span>} />
        <ProductDemandTable />
      </Card>
      <StageAction
        label="Approve replenishment"
        completedLabel="Replenishment approved"
        helper="Approve the 100-unit requirement so it can become a supplier commitment."
        completed={scenario.metadata.replenishmentApproved}
        onAction={approveReplenishment}
      />
    </StageFrame>
  );
}

export function SourcingPage() {
  const scenario = useDemoStore((state) => state.scenario);
  const confirmPurchaseOrder = useDemoStore((state) => state.confirmPurchaseOrder);
  const po = getHeroPurchaseOrder(scenario);
  const supplier = scenario.suppliers.find((item) => item.id === po?.supplierId);
  const line = scenario.purchaseOrderLines.find((item) => item.poId === po?.id);
  const forecast = scenario.forecasts.find((item) => item.id === po?.sourceForecastId);
  const product = scenario.products.find((item) => item.sku === line?.sku);
  const warehouse = scenario.warehouses[0];
  const receiptLine = scenario.goodsReceiptLines.find((item) => item.receiptId === scenario.metadata.heroGoodsReceiptId);
  const location = scenario.locations.find((item) => item.id === receiptLine?.locationId);
  const inventory = getHeroInventory(scenario);
  return (
    <StageFrame stageId="sourcing">
      <div className="object-heading">
        <div><span className="eyebrow">PURCHASE COMMITMENT</span><h2><OperationalId>{po?.id ?? "—"}</OperationalId></h2></div>
        <StatusBadge status={po?.status ?? "DRAFT"} />
      </div>
      <div className="kpi-grid kpi-grid--three">
        <KpiCard label="Ordered quantity" value={line?.quantity ?? 0} unit="units" detail={(product?.sku ?? "—") + " · " + (product?.name ?? "")} tone="accent" />
        <KpiCard label="Demand signal" value={forecast && inventory ? calculateReplenishmentRequirement(forecast, inventory) : 0} unit="units" detail="Requirement from Demand Planning" />
        <KpiCard label="Expected arrival" value={po ? formatCompactDate(po.expectedAt) : "—"} detail="Scenario date" />
      </div>
      <Card className="commitment-card">
        <SectionHeader title="Supplier to warehouse" trailing={<span className="fictional-note">FICTIONAL SUPPLIER</span>} />
        <div className="commitment-flow">
          <div className="commitment-party"><span className="party-label">SUPPLIER</span><strong>{supplier?.name ?? "—"}</strong><span>Supplier {supplier?.id ?? "—"}</span></div>
          <div className="commitment-connector"><span>{line?.quantity ?? 0} × {line?.sku ?? "—"}</span><i /></div>
          <div className="commitment-party"><span className="party-label">DESTINATION</span><strong>{warehouse?.name ?? "—"}</strong><span>Single-warehouse scenario</span></div>
        </div>
        <div className="commitment-footer"><span>Source forecast <OperationalId>{forecast?.id ?? "—"}</OperationalId></span><span>Expected at warehouse <OperationalId>{location?.code ?? "—"}</OperationalId></span></div>
      </Card>
      <div className="foundation-note"><span className="note-mark">i</span><p>This is a connected purchase-order concept in an original demo flow. It does not represent a production SCOTI purchasing screen.</p></div>
      <StageAction
        label="Confirm PO-1001"
        completedLabel="PO-1001 confirmed"
        helper={po?.status === "DRAFT" ? "Confirm the commitment to release the replenishment into inbound execution." : "The supplier commitment is ready for the warehouse receipt step."}
        completed={po?.status !== "DRAFT"}
        disabled={!scenario.metadata.replenishmentApproved}
        onAction={confirmPurchaseOrder}
      />
    </StageFrame>
  );
}

export function InboundPage() {
  const scenario = useDemoStore((state) => state.scenario);
  const receivePurchaseOrder = useDemoStore((state) => state.receivePurchaseOrder);
  const receipt = getHeroGoodsReceipt(scenario);
  const line = scenario.goodsReceiptLines.find((item) => item.receiptId === receipt?.id);
  const balance = line ? scenario.inventory.find((item) => item.sku === line.sku) : undefined;
  const po = scenario.purchaseOrders.find((item) => item.id === receipt?.poId);
  const location = scenario.locations.find((item) => item.id === line?.locationId);
  const afterReceipt = balance && line ? balance.onHand + (receipt?.status === "POSTED" ? 0 : line.quantity) : 0;
  return (
    <StageFrame stageId="inbound">
      <div className="object-heading">
        <div><span className="eyebrow">EXPECTED GOODS RECEIPT</span><h2><OperationalId>{receipt?.id ?? "—"}</OperationalId></h2></div>
        <StatusBadge status={receipt?.status ?? "EXPECTED"} />
      </div>
      <div className="kpi-grid kpi-grid--three">
        <KpiCard label="Current on hand" value={balance?.onHand ?? 0} unit="units" detail={line?.sku ?? "—"} />
        <KpiCard label="Receipt quantity" value={line?.quantity ?? 0} unit="units" detail={"Expected from " + (po?.id ?? "—")} tone="accent" />
        <KpiCard label="After receipt" value={afterReceipt} unit="units" detail="Scenario projection" tone="positive" />
      </div>
      <Card className="warehouse-card">
        <div className="warehouse-card-top"><div><span className="eyebrow">RECEIVING OVERVIEW</span><h2>{scenario.warehouses[0]?.name ?? "Warehouse"}</h2></div><OperationalId>{location?.code ?? "—"}</OperationalId></div>
        <div className="warehouse-plan">
          <div className="dock-zone"><span className="zone-label">INBOUND DOCK</span><div className="dock-line"><span className="dock-box">+{line?.quantity ?? 0}</span><span className="dock-track" /></div><p>Receipt {receipt?.status?.toLowerCase() ?? "expected"}</p></div>
          <div className="rack-zone"><span className="zone-label">PUT-AWAY LOCATION</span><div className="rack-visual"><div className="rack-slot rack-slot--active">{location?.code ?? "—"}<strong>{line?.sku ?? "—"}</strong></div></div><p>{line?.quantity ?? 0} units designated for put-away</p></div>
        </div>
      </Card>
      <Card>
        <SectionHeader title="Inventory balance" trailing={<OperationalId>{balance?.id ?? "—"}</OperationalId>} />
        <div className="inventory-ledger">
          <Metric label="On hand" value={balance?.onHand ?? 0} unit="units" />
          <Metric label="Reserved" value={balance?.reserved ?? 0} unit="units" />
          <Metric label="Available" value={balance ? getAvailableInventory(balance) : 0} unit="units" />
        </div>
        {balance && <MetricDelta before={balance.onHand} after={afterReceipt} label="Planned receipt effect" />}
      </Card>
      <StageAction
        label="Post goods receipt"
        completedLabel="Receipt posted"
        helper="Post RCPT-1001 once to add the 100 units to warehouse inventory."
        completed={receipt?.status === "POSTED"}
        disabled={po?.status !== "CONFIRMED"}
        onAction={receivePurchaseOrder}
      />
    </StageFrame>
  );
}

export function OrdersPage() {
  const scenario = useDemoStore((state) => state.scenario);
  const allocateSalesOrder = useDemoStore((state) => state.allocateSalesOrder);
  const order = getHeroOrder(scenario);
  const customer = scenario.customers.find((item) => item.id === order?.customerId);
  const line = scenario.salesOrderLines.find((item) => item.orderId === order?.id);
  const product = scenario.products.find((item) => item.sku === line?.sku);
  const balance = line ? scenario.inventory.find((item) => item.sku === line.sku) : undefined;
  const reservation = scenario.reservations.find((item) => item.orderId === order?.id && item.status === "ACTIVE");
  return (
    <StageFrame stageId="orders">
      <div className="object-heading">
        <div><span className="eyebrow">CUSTOMER ORDER · FICTIONAL CUSTOMER</span><h2><OperationalId>{order?.id ?? "—"}</OperationalId></h2></div>
        <StatusBadge status={order?.status ?? "NEW"} />
      </div>
      <Card className="order-card">
        <div className="order-customer"><div className="customer-mark">{customer?.name.split(" ").map((part) => part[0]).join("") ?? "—"}</div><div><span className="eyebrow">SHIP TO</span><h3>{customer?.name ?? "—"}</h3><p>Fictional customer</p></div><div className="order-promise"><span className="eyebrow">PROMISED BY</span><strong>{order ? formatScenarioDate(order.promisedBy) : "—"}</strong></div></div>
        <div className="order-line"><div><span className="eyebrow">ORDER LINE</span><h3>{product?.name ?? "—"}</h3><p>{line?.sku ?? "—"} · {product?.sizeMl ?? 0} ml</p></div><div className="order-quantity"><strong>{line?.quantity ?? 0}</strong><span>units</span></div></div>
      </Card>
      <Card>
        <SectionHeader title="Inventory allocation" trailing={<span className="table-note">Same warehouse balance</span>} />
        <div className="inventory-ledger">
          <Metric label="On hand" value={balance?.onHand ?? 0} unit="units" />
          <Metric label="Reserved" value={balance?.reserved ?? 0} unit="units" />
          <Metric label="Available" value={balance ? getAvailableInventory(balance) : 0} unit="units" />
        </div>
        <div className="allocation-strip">
          <div><span>Order quantity</span><strong>{line?.quantity ?? 0} units</strong></div>
          <span className="allocation-arrow" aria-hidden="true">→</span>
          <div><span>Active reservation</span><strong>{reservation?.quantity ?? 0} units</strong></div>
          <p>{reservation ? "These units are held for " + order?.id + "." : "Allocation is a future guided interaction; this foundation view is read-only."}</p>
        </div>
      </Card>
      <StageAction
        label="Allocate order"
        completedLabel="Order allocated"
        helper="Reserve the two TS-600 units for ORD-1001 and carry the updated available balance forward."
        completed={order?.status !== "NEW"}
        disabled={scenario.goodsReceipts.find((item) => item.id === scenario.metadata.heroGoodsReceiptId)?.status !== "POSTED"}
        onAction={allocateSalesOrder}
      />
    </StageFrame>
  );
}

export function FulfillmentPage() {
  const scenario = useDemoStore((state) => state.scenario);
  const startFulfillment = useDemoStore((state) => state.startFulfillment);
  const completeFulfillment = useDemoStore((state) => state.completeFulfillment);
  const order = getHeroOrder(scenario);
  const pick = scenario.pickTasks.find((item) => item.orderId === order?.id);
  const pack = scenario.packTasks.find((item) => item.orderId === order?.id);
  const location = scenario.locations.find((item) => item.id === pick?.locationId);
  const product = scenario.products.find((item) => item.sku === pick?.sku);
  return (
    <StageFrame stageId="fulfillment">
      <div className="object-heading"><div><span className="eyebrow">WAREHOUSE EXECUTION</span><h2>Fulfillment task</h2></div><StatusBadge status={pick?.status ?? "NOT_STARTED"} /></div>
      <Card className="fulfillment-board">
        <div className="task-board-header"><div><span className="eyebrow">PICK TASK</span><h3><OperationalId>{pick?.id ?? "—"}</OperationalId></h3></div><OperationalId>{order?.id ?? "—"}</OperationalId></div>
        <div className="pick-visual">
          <div className="pick-location"><span className="zone-label">PICK FROM</span><strong>{location?.code ?? "—"}</strong><span>{product?.name ?? "—"}</span></div>
          <div className="pick-progress"><div className="pick-progress-track"><span style={{ width: pick ? (pick.pickedQty / Math.max(pick.requiredQty, 1) * 100) + "%" : "0%" }} /></div><span>{pick?.pickedQty ?? 0} / {pick?.requiredQty ?? 0} picked</span></div>
          <div className="pick-quantity"><strong>{pick?.requiredQty ?? 0}</strong><span>required</span></div>
        </div>
        <div className="fulfillment-steps">
          <div className={pick?.status === "COMPLETE" ? "fulfillment-step fulfillment-step--done" : "fulfillment-step"}><span>01</span><strong>Pick</strong><small>{pick?.status?.replaceAll("_", " ") ?? "—"}</small></div>
          <div className="fulfillment-connector" />
          <div className={pack?.status === "COMPLETE" ? "fulfillment-step fulfillment-step--done" : "fulfillment-step"}><span>02</span><strong>Pack</strong><small>{pack?.status ?? "—"}</small></div>
          <div className="fulfillment-connector" />
          <div className="fulfillment-step"><span>03</span><strong>Dispatch</strong><small>Shipment stage</small></div>
        </div>
      </Card>
      <div className="kpi-grid kpi-grid--two">
        <KpiCard label="Package" value={pack?.packageId ?? "—"} detail={"Assigned to " + (order?.id ?? "the order")} />
        <KpiCard label="Order status" value={order?.status ?? "—"} detail="Moves forward with pick and pack" tone="accent" />
      </div>
      <StageAction
        label={pick?.status === "IN_PROGRESS" ? "Complete pick and pack" : "Start picking"}
        completedLabel="Pick and pack complete"
        helper={pick?.status === "NOT_STARTED" ? "Start the warehouse task from location A-03-02." : "Complete the pick and pack so the order can be dispatched."}
        completed={pack?.status === "COMPLETE"}
        disabled={pick?.status !== "IN_PROGRESS" && pick?.status !== "NOT_STARTED"}
        onAction={pick?.status === "IN_PROGRESS" ? completeFulfillment : startFulfillment}
      />
    </StageFrame>
  );
}

export function ShipmentPage() {
  const scenario = useDemoStore((state) => state.scenario);
  const dispatchShipment = useDemoStore((state) => state.dispatchShipment);
  const advanceShipment = useDemoStore((state) => state.advanceShipment);
  const shipment = getHeroShipment(scenario);
  const order = getHeroOrder(scenario);
  const carrier = scenario.carriers.find((item) => item.id === shipment?.carrierId);
  const trackingEvents = scenario.trackingEvents.filter((event) => event.shipmentId === shipment?.id);
  const milestones = [
    { status: "DISPATCHED", label: "Dispatched", at: scenario.metadata.timeline.shipmentDispatchedAt },
    { status: "IN_TRANSIT", label: "In transit", at: scenario.metadata.timeline.shipmentInTransitAt },
    { status: "OUT_FOR_DELIVERY", label: "Out for delivery", at: scenario.metadata.timeline.shipmentOutForDeliveryAt },
    { status: "DELIVERED", label: "Delivered", at: scenario.metadata.timeline.shipmentDeliveredAt },
  ];
  const rank = milestones.findIndex((item) => item.status === shipment?.status);
  return (
    <StageFrame stageId="shipment">
      <div className="object-heading">
        <div><span className="eyebrow">SHIPMENT · ORDER {order?.id ?? "—"}</span><h2><OperationalId>{shipment?.id ?? "—"}</OperationalId></h2></div>
        <StatusBadge status={shipment?.status ?? "PLANNED"} />
      </div>
      <div className="kpi-grid kpi-grid--three">
        <KpiCard label="Carrier" value={carrier?.name ?? "—"} detail="Fictional parcel carrier" />
        <KpiCard label="Package" value={shipment?.packageId ?? "—"} detail="Linked fulfillment package" />
        <KpiCard label="Promised delivery" value={order ? formatCompactDate(order.promisedBy) : "—"} detail="Scenario date" tone="accent" />
      </div>
      <Card className="shipment-card">
        <SectionHeader title="Delivery milestones" trailing={<span className="fictional-note">SIMULATED TRACKING</span>} />
        <ol className="shipment-milestones">
          {milestones.map((milestone, index) => {
            const complete = rank >= index && rank >= 0;
            const current = shipment?.status === milestone.status;
            return <li className={(complete ? "milestone milestone--complete " : "milestone ") + (current ? "milestone--current" : "")} key={milestone.status}><span className="milestone-dot">{complete ? "✓" : ""}</span><span>{milestone.label}</span><small>{formatCompactDate(trackingEvents.find((event) => event.type === milestone.status)?.timestamp ?? milestone.at)}</small></li>;
          })}
        </ol>
        <div className="shipment-route"><span>{scenario.warehouses[0]?.name ?? "Origin warehouse"}</span><i /><strong>{trackingEvents.at(-1)?.locationLabel ?? "Destination pending"}</strong></div>
      </Card>
      <Surface className="foundation-note"><span className="note-mark">i</span><p>All carrier and tracking information is fictional scenario data. No external carrier service or map is connected.</p></Surface>
      <StageAction
        label={shipment?.status === "PLANNED" ? "Dispatch shipment" : "Advance tracking"}
        completedLabel="Shipment delivered"
        helper={shipment?.status === "PLANNED" ? "Dispatch SHP-1001 from the warehouse." : "Advance the simulated carrier milestone to the next delivery state."}
        completed={shipment?.status === "DELIVERED"}
        disabled={shipment?.status === "PLANNED" ? order?.status !== "PACKED" : false}
        onAction={() => shipment?.status === "PLANNED" ? dispatchShipment() : advanceShipment(shipment?.status ?? "PLANNED")}
      />
    </StageFrame>
  );
}

export function ControlTowerPage() {
  const scenario = useDemoStore((state) => state.scenario);
  const events = getActivityTimeline(scenario);
  const inventory = getHeroInventory(scenario);
  const po = getHeroPurchaseOrder(scenario);
  const receipt = getHeroGoodsReceipt(scenario);
  const order = getHeroOrder(scenario);
  const shipment = getHeroShipment(scenario);
  return (
    <StageFrame stageId="control-tower">
      <div className="object-heading"><div><span className="eyebrow">CONNECTED OPERATIONAL STORY</span><h2>One thread. Every handoff.</h2></div><span className="table-note">Scenario date · {formatScenarioDate(getCurrentScenarioDate(scenario))}</span></div>
      <div className="tower-status-grid">
        <div><span>{po?.id ?? "—"}</span><StatusBadge status={po?.status ?? "DRAFT"} /></div>
        <div><span>{receipt?.id ?? "—"}</span><StatusBadge status={receipt?.status ?? "EXPECTED"} /></div>
        <div><span>{order?.id ?? "—"}</span><StatusBadge status={order?.status ?? "NEW"} /></div>
        <div><span>{shipment?.id ?? "—"}</span><StatusBadge status={shipment?.status ?? "PLANNED"} /></div>
      </div>
      <div className="tower-layout">
        <Card className="tower-timeline">
          <SectionHeader title="Activity timeline" trailing={<span className="table-note">{events.length} events</span>} />
          <Timeline events={events} />
        </Card>
        <Card className="tower-inventory">
          <SectionHeader title="Hero inventory" />
          <div className="tower-inventory-sku"><span className="eyebrow">SKU</span><OperationalId>{scenario.metadata.heroSku}</OperationalId></div>
          <Metric label="On hand" value={inventory?.onHand ?? 0} unit="units" />
          <Metric label="Reserved" value={inventory?.reserved ?? 0} unit="units" />
          <Metric label="Available" value={inventory ? getAvailableInventory(inventory) : 0} unit="units" />
          <div className="tower-stock-rule">Available = on hand − reserved</div>
        </Card>
      </div>
      <Card className="entity-chain-card">
        <SectionHeader title="Hero entity chain" trailing={<span className="table-note">Fictional identifiers</span>} />
        <div className="entity-chain">
          {[scenario.metadata.heroSku, scenario.metadata.heroPurchaseOrderId, scenario.metadata.heroGoodsReceiptId, scenario.metadata.heroOrderId, scenario.metadata.heroShipmentId].map((id, index) => (
            <div className="entity-chain-item" key={id}><span>0{index + 1}</span><OperationalId>{id}</OperationalId>{index < 4 && <i aria-hidden="true" />}</div>
          ))}
        </div>
      </Card>
    </StageFrame>
  );
}
