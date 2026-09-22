import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { appRoutes } from "../app/router";
import { useDemoStore } from "../store/demoStore";
import { getPresentation } from "../domain/presentation";
import { getScenarioInvariantViolations } from "../domain/invariants";

beforeEach(() => useDemoStore.getState().resetScenario());

describe("connected marketing walkthrough", () => {
  it("completes the lifecycle, keeps the story quantities current, and carries state into Control Tower", () => {
    render(
      <RouterProvider
        router={createMemoryRouter(appRoutes, { initialEntries: ["/"] })}
      />,
    );
    const controls = within(
      screen.getByRole("region", { name: "Interactive scenario controls" }),
    );
    const actions = [
      "Approve replenishment",
      "Confirm purchase order",
      "Receive inventory",
      "Allocate the order",
      "Start picking",
      "Complete pick & pack",
      "Dispatch shipment",
      "Advance to in transit",
      "Advance to out for delivery",
      "Confirm delivery",
    ];
    for (const name of actions) {
      fireEvent.click(controls.getByRole("button", { name }));
      expect(
        getScenarioInvariantViolations(useDemoStore.getState().scenario),
      ).toEqual([]);
    }
    const p = getPresentation(useDemoStore.getState().scenario);
    expect(p.available).toBe(138);
    expect(p.completed).toBe(10);
    expect(p.next).toBeUndefined();
    expect(p.shipment.status).toBe("DELIVERED");
    fireEvent.click(controls.getByRole("link", { name: /Open Control Tower/ }));
    expect(
      screen.getByRole("heading", { name: "One thread. Every handoff." }),
    ).toBeInTheDocument();
    expect(useDemoStore.getState().scenario.shipments[0].status).toBe(
      "DELIVERED",
    );
  });

  it("confirms reset and restores all canonical inventory and progression", () => {
    render(
      <RouterProvider
        router={createMemoryRouter(appRoutes, { initialEntries: ["/"] })}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Approve replenishment" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Confirm purchase order" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Receive inventory" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset scenario" }));
    fireEvent.click(
      within(screen.getByRole("alertdialog")).getByRole("button", {
        name: "Reset scenario",
      }),
    );
    const p = getPresentation(useDemoStore.getState().scenario);
    expect(p.inventory.onHand).toBe(40);
    expect(p.available).toBe(40);
    expect(p.requirement).toBe(100);
    expect(p.completed).toBe(0);
    expect(
      screen.getByRole("button", { name: "Approve replenishment" }),
    ).toBeInTheDocument();
  });

  it("provides keyboard navigation for the spatial explorer without WebGL", () => {
    render(
      <RouterProvider
        router={createMemoryRouter(appRoutes, { initialEntries: ["/"] })}
      />,
    );
    const first = screen.getByRole("tab", { name: /The connected network/ });
    first.focus();
    fireEvent.keyDown(first, { key: "ArrowRight" });
    expect(
      screen.getByRole("tab", { name: /Inside the warehouse/ }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("heading", { name: "Go beyond the warehouse walls." }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("img", {
        name: "Warehouse connected to supplier and delivery locations",
      }).length,
    ).toBeGreaterThan(0);
  });
});
