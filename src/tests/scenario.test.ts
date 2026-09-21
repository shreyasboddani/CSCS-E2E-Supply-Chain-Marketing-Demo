import { describe, expect, it } from "vitest";
import scenarioJson from "../data/scenario.json";
import { initialScenario } from "../data/initialScenario";
import {
  calculateReplenishmentRequirement,
  getAvailableInventory,
  getCurrentScenarioDate,
  getHeroInventory,
  getHeroOrder,
  getHeroShipment,
} from "../domain/selectors";
import { getScenarioInvariantViolations } from "../domain/invariants";
import type { DemoScenario } from "../domain/types";

describe("canonical retail demo scenario", () => {
  it("starts with 40 on hand, 0 reserved, and 40 available for TS-600", () => {
    const inventory = getHeroInventory(initialScenario);
    expect(inventory).toMatchObject({ onHand: 40, reserved: 0 });
    expect(inventory && getAvailableInventory(inventory)).toBe(40);
  });

  it("calculates 120 forecast + 20 target - 40 available as 100 required", () => {
    const forecast = initialScenario.forecasts.find((item) => item.sku === "TS-600");
    const inventory = getHeroInventory(initialScenario);
    expect(forecast && inventory && calculateReplenishmentRequirement(forecast, inventory)).toBe(100);
    expect(initialScenario.forecasts.find((item) => item.sku === "TS-1000")).toMatchObject({
      forecastQty: 45,
      targetEndingQty: 10,
    });
    expect(initialScenario.forecasts.find((item) => item.sku === "TS-350")).toMatchObject({
      forecastQty: 70,
      targetEndingQty: 15,
    });
    for (const sku of ["TS-1000", "TS-350"]) {
      const backgroundForecast = initialScenario.forecasts.find((item) => item.sku === sku);
      const backgroundInventory = initialScenario.inventory.find((item) => item.sku === sku);
      expect(
        backgroundForecast && backgroundInventory
          ? calculateReplenishmentRequirement(backgroundForecast, backgroundInventory)
          : -1,
      ).toBe(0);
    }
  });

  it("locks the hero entities and contains a consistent deterministic seed", () => {
    expect(scenarioJson).toEqual(initialScenario);
    expect(initialScenario.purchaseOrderLines.find((line) => line.poId === "PO-1001")).toMatchObject({
      sku: "TS-600",
      quantity: 100,
    });
    expect(initialScenario.salesOrderLines.find((line) => line.orderId === "ORD-1001")).toMatchObject({
      sku: "TS-600",
      quantity: 2,
    });
    expect(getHeroOrder(initialScenario)?.id).toBe("ORD-1001");
    expect(getHeroShipment(initialScenario)).toMatchObject({ id: "SHP-1001", orderId: "ORD-1001" });
    expect(getScenarioInvariantViolations(initialScenario as DemoScenario)).toEqual([]);
    expect(getCurrentScenarioDate(initialScenario)).toBe("2026-08-12");
  });
});
