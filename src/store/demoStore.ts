import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { initialScenario } from "../data/initialScenario";
import {
  allocateSalesOrder,
  advanceShipment,
  approveReplenishment,
  completeFulfillment,
  confirmPurchaseOrder,
  dispatchShipment,
  receivePurchaseOrder,
  resetScenario as getResetScenario,
  startFulfillment,
} from "../domain/transitions";
import type { DemoScenario, JourneyMode, ShipmentStatus } from "../domain/types";

interface DemoStore {
  scenario: DemoScenario;
  mode: JourneyMode;
  setMode: (mode: JourneyMode) => void;
  approveReplenishment: () => void;
  confirmPurchaseOrder: () => void;
  receivePurchaseOrder: () => void;
  allocateSalesOrder: () => void;
  startFulfillment: () => void;
  completeFulfillment: () => void;
  dispatchShipment: () => void;
  advanceShipment: (expectedStatus: ShipmentStatus) => void;
  resetScenario: () => void;
}

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      scenario: initialScenario,
      mode: "guided",
      setMode: (mode) => set({ mode }),
      approveReplenishment: () =>
        set({ scenario: approveReplenishment(get().scenario) }),
      confirmPurchaseOrder: () =>
        set({ scenario: confirmPurchaseOrder(get().scenario) }),
      receivePurchaseOrder: () =>
        set({ scenario: receivePurchaseOrder(get().scenario) }),
      allocateSalesOrder: () =>
        set({ scenario: allocateSalesOrder(get().scenario) }),
      startFulfillment: () =>
        set({ scenario: startFulfillment(get().scenario) }),
      completeFulfillment: () =>
        set({ scenario: completeFulfillment(get().scenario) }),
      dispatchShipment: () =>
        set({ scenario: dispatchShipment(get().scenario) }),
      advanceShipment: (expectedStatus) =>
        set({ scenario: advanceShipment(get().scenario, expectedStatus) }),
      resetScenario: () => set({ scenario: getResetScenario() }),
    }),
    {
      name: "cscs-scoti-demo-session-v1",
      version: 1,
      storage: createJSONStorage(() => window.sessionStorage),
      partialize: (state) => ({ scenario: state.scenario, mode: state.mode }),
    },
  ),
);
