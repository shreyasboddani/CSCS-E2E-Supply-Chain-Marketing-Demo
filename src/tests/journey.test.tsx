import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { appRoutes } from "../app/router";
import { useDemoStore } from "../store/demoStore";

const routes = [
  ["/intro", /One supply chain story, from plan to delivery/],
  ["/demand", "Demand Planning"],
  ["/sourcing", "Sourcing"],
  ["/inbound", "Inbound & Warehouse"],
  ["/orders", "Order Management"],
  ["/fulfillment", "Fulfillment"],
  ["/shipment", "Shipment & Delivery"],
  ["/control-tower", "One thread. Every handoff."],
] as const;

beforeEach(() => {
  window.sessionStorage.clear();
  useDemoStore.getState().resetScenario();
  useDemoStore.getState().setMode("guided");
});

describe("guided demo shell", () => {
  it.each(routes)("renders the shared shell and %s route", (path, heading) => {
    const router = createMemoryRouter(appRoutes, { initialEntries: [path] });
    render(<RouterProvider router={router} />);

    expect(screen.getByRole("navigation", { name: "Demo stages" })).toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Stage narrative" })).toBeInTheDocument();
    expect(screen.getByText(/Intern Concept Demo/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
  });

  it("shows the linked demand math from the shared scenario", () => {
    const router = createMemoryRouter(appRoutes, { initialEntries: ["/demand"] });
    render(<RouterProvider router={router} />);

    const requirementCard = screen.getByText("Requirement", { exact: true }).closest(".kpi-card");
    expect(requirementCard).toHaveTextContent("100");
    expect(screen.getByRole("row", { name: /TS-600/ })).toHaveTextContent("Everyday 600");
  });
});
