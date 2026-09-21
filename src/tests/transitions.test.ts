import { describe, expect, it } from "vitest";
import { initialScenario } from "../data/initialScenario";
import {
  getActivityTimeline,
  getAvailableInventory,
  getHeroInventory,
  getHeroOrder,
  getHeroPurchaseOrder,
  getHeroShipment,
  getCurrentScenarioDate,
} from "../domain/selectors";
import { getScenarioInvariantViolations } from "../domain/invariants";
import {
  advanceShipment,
  allocateSalesOrder,
  approveReplenishment,
  completeFulfillment,
  confirmPurchaseOrder,
  dispatchShipment,
  receivePurchaseOrder,
  resetScenario,
  startFulfillment,
} from "../domain/transitions";

const toReceived = () => receivePurchaseOrder(confirmPurchaseOrder(approveReplenishment(initialScenario)));
const toPacked = () => completeFulfillment(startFulfillment(allocateSalesOrder(toReceived())));

describe("guarded scenario transitions", () => {
  it("adds exactly 100 units once when RCPT-1001 is received", () => {
    const received = toReceived();
    const inventory = getHeroInventory(received);
    expect(getCurrentScenarioDate(received)).toBe("2026-08-18");
    expect(inventory).toMatchObject({ onHand: 140, reserved: 0 });
    expect(inventory && getAvailableInventory(inventory)).toBe(140);
    expect(receivePurchaseOrder(received)).toBe(received);
  });

  it("reserves two units once when ORD-1001 is allocated", () => {
    const allocated = allocateSalesOrder(toReceived());
    const inventory = getHeroInventory(allocated);
    expect(inventory).toMatchObject({ onHand: 140, reserved: 2 });
    expect(inventory && getAvailableInventory(inventory)).toBe(138);
    expect(getHeroOrder(allocated)?.status).toBe("ALLOCATED");
    expect(allocateSalesOrder(allocated)).toBe(allocated);
  });

  it("moves the order through pick and pack without duplicate work", () => {
    const picking = startFulfillment(allocateSalesOrder(toReceived()));
    const packed = completeFulfillment(picking);
    expect(getHeroOrder(packed)?.status).toBe("PACKED");
    expect(packed.pickTasks[0]).toMatchObject({ status: "COMPLETE", requiredQty: 2, pickedQty: 2 });
    expect(packed.packTasks[0]?.status).toBe("COMPLETE");
    expect(completeFulfillment(packed)).toBe(packed);
  });

  it("dispatches once, leaves 138 on hand, and releases the two-unit reservation", () => {
    const packed = toPacked();
    const dispatched = dispatchShipment(packed);
    const inventory = getHeroInventory(dispatched);
    expect(inventory).toMatchObject({ onHand: 138, reserved: 0 });
    expect(inventory && getAvailableInventory(inventory)).toBe(138);
    expect(getHeroShipment(dispatched)?.status).toBe("DISPATCHED");
    expect(dispatched.reservations[0]?.status).toBe("RELEASED");
    expect(dispatchShipment(dispatched)).toBe(dispatched);
  });

  it("advances a shipment deterministically through delivery", () => {
    let scenario = dispatchShipment(toPacked());
    scenario = advanceShipment(scenario, "DISPATCHED");
    expect(getHeroShipment(scenario)?.status).toBe("IN_TRANSIT");
    expect(advanceShipment(scenario, "DISPATCHED")).toBe(scenario);
    scenario = advanceShipment(scenario, "IN_TRANSIT");
    expect(getHeroShipment(scenario)?.status).toBe("OUT_FOR_DELIVERY");
    scenario = advanceShipment(scenario, "OUT_FOR_DELIVERY");
    expect(getHeroShipment(scenario)?.status).toBe("DELIVERED");
    expect(getHeroOrder(scenario)?.status).toBe("DELIVERED");
    expect(advanceShipment(scenario, "OUT_FOR_DELIVERY")).toBe(scenario);
  });

  it("keeps timeline events chronological and entity references resolved", () => {
    let scenario = dispatchShipment(toPacked());
    scenario = advanceShipment(
      advanceShipment(advanceShipment(scenario, "DISPATCHED"), "IN_TRANSIT"),
      "OUT_FOR_DELIVERY",
    );
    expect(getActivityTimeline(scenario).map((event) => event.timestamp)).toEqual(
      [...scenario.activityEvents].map((event) => event.timestamp).sort(),
    );
    expect(getScenarioInvariantViolations(scenario)).toEqual([]);
  });

  it("restores the exact canonical seed on reset", () => {
    expect(resetScenario()).toEqual(initialScenario);
  });

  it("does not confirm a purchase order before the requirement is approved", () => {
    expect(getHeroPurchaseOrder(confirmPurchaseOrder(initialScenario))?.status).toBe("DRAFT");
  });
});
