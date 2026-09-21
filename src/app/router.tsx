import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import { DemoShell } from "./DemoShell";
import {
  ControlTowerPage,
  DemandPage,
  FulfillmentPage,
  InboundPage,
  IntroPage,
  OrdersPage,
  ShipmentPage,
  SourcingPage,
} from "../features/stages/StagePages";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <DemoShell />,
    children: [
      { index: true, element: <Navigate to="/intro" replace /> },
      { path: "intro", element: <IntroPage /> },
      { path: "demand", element: <DemandPage /> },
      { path: "sourcing", element: <SourcingPage /> },
      { path: "inbound", element: <InboundPage /> },
      { path: "orders", element: <OrdersPage /> },
      { path: "fulfillment", element: <FulfillmentPage /> },
      { path: "shipment", element: <ShipmentPage /> },
      { path: "control-tower", element: <ControlTowerPage /> },
      { path: "*", element: <Navigate to="/intro" replace /> },
    ],
  },
];

export const router = createBrowserRouter(appRoutes);
