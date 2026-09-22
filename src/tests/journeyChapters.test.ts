import { expect, it } from "vitest";
import { buildJourneyChapters } from "../narrative/journeyChapters";
import { getPresentation } from "../domain/presentation";
import { useDemoStore } from "../store/demoStore";

it("narrates every handoff without changing business state and reflects executed receipts", () => {
  useDemoStore.getState().resetScenario();
  const scenario = useDemoStore.getState().scenario;
  const before = JSON.stringify(scenario);
  const chapters = buildJourneyChapters(scenario, getPresentation(scenario));
  expect(chapters.map(chapter => chapter.id)).toEqual([
    "demand", "sourcing", "inbound-transit", "receiving", "inventory", "orders",
    "fulfillment", "dispatch", "delivery", "control",
  ]);
  expect(chapters.every(chapter => !chapter.done)).toBe(true);
  expect(JSON.stringify(scenario)).toBe(before);
  useDemoStore.getState().approveReplenishment();
  useDemoStore.getState().confirmPurchaseOrder();
  useDemoStore.getState().receivePurchaseOrder();
  const updated = useDemoStore.getState().scenario;
  const next = buildJourneyChapters(updated, getPresentation(updated));
  expect(next.find(chapter => chapter.id === "inventory")?.metrics[0].value).toBe("140");
  expect(next.find(chapter => chapter.id === "receiving")?.done).toBe(true);
  expect(next.find(chapter => chapter.id === "delivery")?.done).toBe(false);
  useDemoStore.getState().resetScenario();
});
