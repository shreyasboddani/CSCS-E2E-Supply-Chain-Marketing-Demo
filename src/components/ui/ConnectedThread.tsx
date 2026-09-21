import type { DemoScenario } from "../../domain/types";
import { getHeroOrder, getHeroPurchaseOrder, getHeroShipment, getHeroGoodsReceipt, getJourneyProgress } from "../../domain/selectors";

const threadLabels = ["Demand", "PO", "Receipt", "Inventory", "Order", "Fulfillment", "Shipment", "Delivery"];

export function ConnectedThread({ scenario }: { scenario: DemoScenario }) {
  const progress = getJourneyProgress(scenario);
  const purchaseOrder = getHeroPurchaseOrder(scenario);
  const receipt = getHeroGoodsReceipt(scenario);
  const order = getHeroOrder(scenario);
  const shipment = getHeroShipment(scenario);
  const done = [
    progress.completedStages.includes("demand"),
    purchaseOrder?.status === "CONFIRMED" || purchaseOrder?.status === "RECEIVED",
    receipt?.status === "POSTED",
    receipt?.status === "POSTED",
    order !== undefined && order.status !== "NEW",
    ["PACKED", "SHIPPED", "DELIVERED"].includes(order?.status ?? ""),
    shipment !== undefined && shipment.status !== "PLANNED",
    shipment?.status === "DELIVERED",
  ];

  return (
    <ol className="connected-thread" aria-label="Connected scenario milestones">
      {threadLabels.map((label, index) => (
        <li className={done[index] ? "thread-node thread-node--complete" : "thread-node"} key={label}>
          <span className="thread-dot" aria-hidden="true">{done[index] ? "✓" : ""}</span>
          <span className="thread-label">{label}</span>
        </li>
      ))}
    </ol>
  );
}
