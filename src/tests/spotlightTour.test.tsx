import { fireEvent, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, expect, it } from "vitest";
import { appRoutes } from "../app/router";
import { useDemoStore } from "../store/demoStore";
import { getDecisionPreview } from "../domain/guidance";
import { getPresentation } from "../domain/presentation";

beforeEach(() => { useDemoStore.getState().resetScenario(); useDemoStore.getState().setMode("guided"); });

it("preserves the original screen and moves the spotlight without mutating scenario data", () => {
  const scenario = useDemoStore.getState().scenario;
  const before = JSON.stringify(scenario);
  getDecisionPreview(scenario);
  render(<RouterProvider router={createMemoryRouter(appRoutes, { initialEntries: ["/demo/demand"] })} />);
  expect(screen.getByRole("complementary", { name: "Stage narrative" })).toBeInTheDocument();
  const tour = within(screen.getByRole("complementary", { name: "SCOTI spotlight guide" }));
  fireEvent.click(tour.getByRole("button", { name: /Show me what to review/ }));
  expect(document.querySelector(".kpi-grid")).toHaveAttribute("data-tour-focus", "true");
  fireEvent.click(tour.getByRole("button", { name: /Show me the action/ }));
  expect(document.querySelector(".stage-action")).toHaveAttribute("data-tour-focus", "true");
  fireEvent.click(tour.getByRole("button", { name: /See this connection in 3D/ }));
  expect(tour.getByRole("img", { name: /Distribution floor/ })).toBeInTheDocument();
  expect(JSON.stringify(useDemoStore.getState().scenario)).toBe(before);
  fireEvent.click(screen.getByRole("button", { name: "Approve replenishment" }));
  expect(tour.getByRole("heading", { name: "See what changed." })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Completed" })).toBeDisabled();
  fireEvent.keyDown(window, { key: "Escape" });
  expect(screen.queryByRole("complementary", { name: "SCOTI spotlight guide" })).not.toBeInTheDocument();
  expect(document.querySelector("[data-tour-focus]")).toBeNull();
  expect(useDemoStore.getState().scenario.metadata.replenishmentApproved).toBe(true);
});

it("follows the original buttons through all decisions and into the Control Tower", () => {
  render(<RouterProvider router={createMemoryRouter(appRoutes, { initialEntries: ["/demo/demand"] })} />);
  const labels = ["Approve replenishment", "Confirm PO-1001", "Post goods receipt", "Allocate order", "Start picking", "Complete pick and pack", "Dispatch shipment", "Advance tracking", "Advance tracking", "Advance tracking"];
  labels.forEach((label, index) => {
    const tour = within(screen.getByRole("complementary", { name: "SCOTI spotlight guide" }));
    fireEvent.click(screen.getByRole("button", { name: label }));
    expect(getPresentation(useDemoStore.getState().scenario).completed).toBe(index + 1);
    const nextAction = tour.queryByRole("button", { name: /Explain the next action/ });
    if (nextAction) fireEvent.click(nextAction);
    else fireEvent.click(tour.getByRole("link", { name: /Continue to/ }));
  });
  expect(screen.getByRole("heading", { name: "One thread. Every handoff." })).toBeInTheDocument();
  expect(getPresentation(useDemoStore.getState().scenario).available).toBe(138);
}, 20000);
