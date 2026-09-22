import { useState } from "react";
import { Link } from "react-router-dom";
import { useDemoStore } from "../store/demoStore";
import { getPresentation } from "../domain/presentation";
import { Button, Modal } from "../components/ui/primitives";

export function JourneyConsole({ compact = false }: { compact?: boolean }) {
  const store = useDemoStore();
  const p = getPresentation(store.scenario);
  const [resetOpen, setResetOpen] = useState(false);
  const next = p.next;
  const run = () => {
    if (!next) return;
    if (next.action === "advanceShipment")
      store.advanceShipment(p.shipment.status);
    else store[next.action]();
  };
  return (
    <section
      className={
        "journey-console" + (compact ? " journey-console--compact" : "")
      }
      aria-label="Interactive scenario controls"
    >
      <div className="console-top">
        <span>
          <i /> SCENARIO WORKSPACE
        </span>
        <span>
          {String(p.completed).padStart(2, "0")} / {p.total}
        </span>
      </div>
      <div
        className="console-progress"
        role="progressbar"
        aria-label="Scenario completion"
        aria-valuenow={p.completed}
        aria-valuemin={0}
        aria-valuemax={p.total}
      >
        <i style={{ width: `${(p.completed / p.total) * 100}%` }} />
      </div>
      <div className="console-content">
        <p className="launch-eyebrow">
          {next ? "YOUR NEXT DECISION" : "THE PROMISE, DELIVERED"}
        </p>
        <h3>{next?.label ?? "Every handoff. Connected."}</h3>
        <p>
          {next?.description ??
            "The order is delivered. Explore the complete activity trail or reset to tell the story again."}
        </p>
        <dl className="console-numbers">
          <div>
            <dt>On hand</dt>
            <dd>{p.inventory.onHand}</dd>
          </div>
          <div>
            <dt>Reserved</dt>
            <dd>{p.inventory.reserved}</dd>
          </div>
          <div>
            <dt>Available</dt>
            <dd>{p.available}</dd>
          </div>
        </dl>
        <div className="console-entity">
          <span>{p.shipment.id}</span>
          <strong>{p.shipment.status.replaceAll("_", " ")}</strong>
        </div>
        <div className="console-actions">
          {next ? (
            <button className="launch-button" onClick={run}>
              {next.label}
              <span aria-hidden="true">→</span>
            </button>
          ) : (
            <Link className="launch-button" to="/demo/control-tower">
              Open Control Tower <span aria-hidden="true">↗</span>
            </Link>
          )}
          <button className="console-reset" onClick={() => setResetOpen(true)}>
            Reset scenario
          </button>
        </div>
      </div>
      <div className="console-event" aria-live="polite">
        <span className="event-dot" />
        <span>
          {store.scenario.activityEvents.at(-1)?.message ??
            "Ready for the first demand decision."}
        </span>
      </div>
      <Modal
        open={resetOpen}
        title="Reset this scenario?"
        description="This clears the walkthrough and restores the original stock, order, and shipment state."
        onClose={() => setResetOpen(false)}
      >
        <Button
          onClick={() => {
            store.resetScenario();
            setResetOpen(false);
          }}
        >
          Reset scenario
        </Button>
      </Modal>
    </section>
  );
}
