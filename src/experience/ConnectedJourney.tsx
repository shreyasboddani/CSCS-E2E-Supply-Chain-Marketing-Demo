import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { useDemoStore } from "../store/demoStore";
import { getPresentation } from "../domain/presentation";
import { buildJourneyChapters } from "../narrative/journeyChapters";
import { SupplyWorld } from "./SupplyWorld";
import "./connectedJourney.css";

const connections = [
  "Forecast → replenishment requirement", "Requirement → purchase order", "Purchase order → expected receipt",
  "Receipt → shared inventory", "Shared inventory → available to promise", "Order → reservation",
  "Reservation → pick task → package", "Package → shipment → stock movement", "Delivery → completed order",
  "All activity → one connected timeline",
];

export function ConnectedJourney() {
  const scenario = useDemoStore(s => s.scenario);
  const chapters = buildJourneyChapters(scenario, getPresentation(scenario));
  const section = useRef<HTMLElement>(null);
  const [position, setPosition] = useState(0);
  const reduced = useReducedMotion();
  const active = Math.min(chapters.length - 1, Math.floor(position));
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const node = section.current;
      if (!node) return;
      const cards = Array.from(node.querySelectorAll<HTMLElement>(".chain-chapter"));
      const anchor = window.innerHeight * 0.4;
      let next = 0;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= anchor) next = index + Math.min(0.999, Math.max(0, (anchor - rect.top) / rect.height));
      });
      setPosition(Math.min(cards.length - 1, next));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  return <section className="connected-journey" ref={section} aria-label="The complete connected supply chain story">
    <header className="chain-intro">
      <p className="launch-eyebrow">THE COMPLETE JOURNEY / TEN CONNECTED CHAPTERS</p>
      <h2>Follow the promise.<br /><em>From the first signal to the front door.</em></h2>
      <p>Travel through one connected operation. Discover how planning, warehouse execution, orders, and transportation come together in the SCOTI™ operating-layer concept.</p>
      <span>Scroll to travel · Illustrative choreography · Metrics show your current demo state</span>
    </header>
    <div className="chain-layout">
      <div className="chain-stage">
        <div className="chain-stage-top"><strong>SCOTI<sup>™</sup> / CONNECTED OPERATIONS</strong><span>{String(active + 1).padStart(2, "0")} / 10</span></div>
        <SupplyWorld chapter={reduced ? active : position} interactive={false} />
        <div className="chain-scene-label"><span>EXPLORING</span><strong>{chapters[active].label}</strong><small>Illustrative movement, not live tracking</small></div>
        <nav className="chain-navigation" aria-label="Story chapters">
          {chapters.map((chapter, index) => <a key={chapter.id} href={"#chain-" + chapter.id} aria-current={index === active ? "step" : undefined} title={chapter.label}><span>{String(index + 1).padStart(2, "0")}</span><span className="sr-only">{chapter.label}</span></a>)}
        </nav>
      </div>
      <div className="chain-chapters">
        {chapters.map((chapter, index) => <article id={"chain-" + chapter.id} className="chain-chapter" key={chapter.id}>
          <div className="chain-chapter-content">
            <p className="launch-eyebrow">{chapter.eyebrow}</p>
            <h3>{chapter.title}</h3><p>{chapter.body}</p>
            <div className="chain-os"><span>THE SCOTI CONNECTION</span><strong>{connections[index]}</strong></div>
            <dl className="chain-metrics">{chapter.metrics.map(metric => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}<small>{metric.note}</small></dd></div>)}</dl>
            <div className="chain-entities">{chapter.entities.map(entity => <span key={entity}>{entity}</span>)}</div>
            <div className="chain-chapter-bottom"><span>{chapter.done ? "Completed in your demo" : "Explore this planned handoff"}</span><Link to={"/demo/" + chapter.stage}>Open workspace ↗</Link></div>
          </div>
        </article>)}
      </div>
    </div>
    <div className="chain-outro"><span>PLAN → SOURCE → RECEIVE → FULFILL → DELIVER</span><h3>One continuous story.<br />One shared operational picture.</h3><a className="launch-text-link" href="#operate">Now make the decisions yourself ↗</a></div>
  </section>;
}
