import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDemoStore } from "../../store/demoStore";
import { getPresentation } from "../../domain/presentation";
import { getDecisionPreview } from "../../domain/guidance";
import type { StageId } from "../../domain/types";
import { stageDefinitions } from "../../narrative/stageCopy";
import { guideCopy } from "../../narrative/guideCopy";
import { SupplyWorld } from "../../experience/SupplyWorld";
import "./spotlightTour.css";

export function SpotlightTour({ stageId, prefix }: { stageId: StageId; prefix: string }) {
  const scenario = useDemoStore(s => s.scenario);
  const setMode = useDemoStore(s => s.setMode);
  const [tip, setTip] = useState(0);
  const [visual, setVisual] = useState(false);
  const [anchor, setAnchor] = useState({ top: 100, left: 250, width: 500, height: 100 });
  const [placement, setPlacement] = useState({ top: 100, left: 700 });
  const panel = useRef<HTMLElement>(null);
  const [initial, setInitial] = useState(getPresentation(scenario).completed);
  const p = getPresentation(scenario);
  const copy = guideCopy[stageId];
  const done = p.completed > initial;
  const preview = getDecisionPreview(scenario);
  const nextStage = stageDefinitions.find(s => s.id === p.next?.module);
  const canAct = p.next?.module === stageId;
  const destination = prefix + (nextStage?.path ?? "/control-tower");
  const selectors = [".stage-header", ".stage-body .kpi-grid, .stage-body .card, .intro-hero", ".stage-action"];
  const selector = done ? ".stage-action" : stageId === "intro" ? ".intro-hero" : stageId === "control-tower" ? ".tower-timeline" : selectors[tip];

  useLayoutEffect(() => {
    const target = document.querySelector<HTMLElement>(selector) ?? document.querySelector<HTMLElement>(".stage-header");
    if (!target) return;
    target.setAttribute("data-tour-focus", "true");
    target.scrollIntoView?.({ block: window.innerWidth < 1200 ? "start" : "center", behavior: "instant" });
    const update = () => {
      const r = target.getBoundingClientRect();
      const width = Math.min(340, window.innerWidth - 24);
      const height = panel.current?.offsetHeight ?? 340;
      const rightRoom = window.innerWidth - r.right;
      const left = rightRoom > width + 24 ? r.right + 16 : r.left > width + 24 ? r.left - width - 16 : window.innerWidth - width - 16;
      const top = rightRoom > width + 24 || r.left > width + 24
        ? Math.max(80, Math.min(r.top, window.innerHeight - height - 16))
        : r.top > height + 96 ? r.top - height - 16 : Math.max(80, window.innerHeight - height - 16);
      setAnchor({ top: r.top - 6, left: r.left - 6, width: r.width + 12, height: r.height + 12 });
      setPlacement({ top, left: Math.max(12, left) });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(target);
    if (panel.current) observer.observe(panel.current);
    return () => { target.removeAttribute("data-tour-focus"); window.removeEventListener("resize", update); window.removeEventListener("scroll", update); observer.disconnect(); };
  }, [selector, visual, done]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMode("explore"); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMode]);

  const reviewNext = () => { setInitial(p.completed); setTip(1); };
  return <>
    <div className="tour-spotlight" style={anchor} aria-hidden="true" />
    <aside className="spotlight-tour" aria-label="SCOTI spotlight guide" ref={panel} style={placement}>
      <div className="tour-topline"><span>SCOTI™ / GUIDED TOUR</span><button onClick={() => setMode("explore")} aria-label="Close guided tour">×</button></div>
      <div className="tour-count"><span>{copy.module}</span><span>{p.completed} / {p.total} decisions</span></div>
      <h2>{done ? "See what changed." : stageId === "intro" ? "One story. Follow the spotlight." : tip === 0 ? copy.title : tip === 1 ? "Read the highlighted records." : "Your turn to make the decision."}</h2>
      <p>{done ? scenario.activityEvents.at(-1)?.message : tip === 0 ? copy.why : tip === 1 ? copy.inspect : canAct ? "Use the highlighted action button on the screen. The shared records will update together. Here is the expected change:" : "This step depends on earlier work. Resume the next unfinished decision to continue in sequence."}</p>
      {tip === 2 && canAct && !done && preview && <dl className="tour-preview">{preview.changes.slice(0, 4).map(change => <div key={change.label}><dt>{change.label}</dt><dd>{String(change.before).replaceAll("_", " ")} <span>→ {String(change.after).replaceAll("_", " ")}</span></dd></div>)}</dl>}
      <button className="tour-visual-toggle" aria-expanded={visual} onClick={() => setVisual(!visual)}>{visual ? "Hide 3D handoff" : "See this connection in 3D"}<span aria-hidden="true">{visual ? "−" : "+"}</span></button>
      {visual && <div className="tour-visual"><SupplyWorld operationsFocus={stageId === "fulfillment" ? 2 : stageId === "shipment" ? 3 : stageId === "orders" ? 1 : 0} interactive={false} /><span>Illustrative warehouse handoff · Shared demo state</span></div>}
      <div className="tour-footer">
        {tip > 0 && !done && <button className="button button--quiet" onClick={() => setTip(tip - 1)}>Back</button>}
        {stageId === "intro" ? <Link className="button button--primary" to={destination}>Start guided walkthrough →</Link>
          : done && canAct ? <button className="button button--primary" onClick={reviewNext}>Explain the next action →</button>
          : done || (!canAct && tip === 2) || stageId === "control-tower" ? <Link className="button button--primary" to={destination} onClick={() => { if (!p.next && stageId === "control-tower") setMode("explore"); }}>{p.next ? `Continue to ${nextStage?.shortLabel}` : stageId === "control-tower" ? "Explore the completed story" : "Continue to Control Tower"} →</Link>
          : tip < 2 ? <button className="button button--primary" onClick={() => setTip(tip + 1)}>{tip === 0 ? "Show me what to review" : "Show me the action"} →</button>
          : <span className="tour-waiting">Click the highlighted action to continue.</span>}
      </div>
      <small className="tour-exit-note">Explore freely anytime · Esc closes this guide</small>
    </aside>
  </>;
}
