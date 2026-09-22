import { useRef } from "react";
import { SupplyWorld } from "./SupplyWorld";
import { useStoryProgress } from "./useStoryProgress";
import { useDemoStore } from "../store/demoStore";
import { getPresentation } from "../domain/presentation";

export function WarehouseJourney() {
  const ref = useRef<HTMLElement>(null);
  const progress = useStoryProgress(ref);
  const scenario = useDemoStore((s) => s.scenario);
  const p = getPresentation(scenario);
  const phase = progress < 0.28 ? 0 : progress < 0.72 ? 1 : 2;
  const beats = [
    {
      label: "01 / RECEIVE",
      title: "A commitment arrives.",
      text: `${p.po.id} connects ${p.incoming} incoming units to ${scenario.warehouses[0].name}.`,
    },
    {
      label: "02 / FULFILL",
      title: "Every unit has a place.",
      text: `${p.location.code} links receiving to the pick task. ${p.inventory.onHand} units on hand, ${p.inventory.reserved} reserved.`,
    },
    {
      label: "03 / DELIVER",
      title: "The promise moves forward.",
      text: `${p.shipment.id} carries ${p.order.id} beyond the dock. Current status: ${p.shipment.status.replaceAll("_", " ").toLowerCase()}.`,
    },
  ];
  return (
    <section
      className="warehouse-journey"
      ref={ref}
      aria-label="Warehouse to delivery story"
    >
      <div className="warehouse-journey-pin">
        <div className="warehouse-journey-header">
          <p className="launch-eyebrow">INSIDE THE CONNECTED OPERATION</p>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
        <div className="warehouse-journey-model">
          <SupplyWorld
            progress={progress}
            view={
              phase === 2 ? "transport" : phase === 1 ? "warehouse" : "network"
            }
            roofOpen={phase === 1}
            interactive={false}
          />
        </div>
        <div className="warehouse-beats">
          {beats.map((beat, i) => (
            <div
              key={beat.label}
              className={
                phase === i
                  ? "warehouse-beat warehouse-beat--active"
                  : "warehouse-beat"
              }
            >
              <span>{beat.label}</span>
              <h3>{beat.title}</h3>
              <p>{beat.text}</p>
              <i />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
