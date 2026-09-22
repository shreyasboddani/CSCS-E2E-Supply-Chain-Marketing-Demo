import { ConnectedJourney } from "./ConnectedJourney";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDemoStore } from "../store/demoStore";
import { getPresentation } from "../domain/presentation";
import { DemoDisclosure } from "../components/ui/DemoDisclosure";
import { SupplyWorld } from "./SupplyWorld";
import { JourneyConsole } from "./JourneyConsole";
import { WarehouseJourney } from "./WarehouseJourney";
import { useStoryProgress } from "./useStoryProgress";
import { stageDefinitions } from "../narrative/stageCopy";
import "./launch.css";
import { RouteViewport } from '../app/RouteViewport';

const views = [
  {
    id: "network",
    label: "The connected network",
    number: "01",
    title: "One view. The whole operation.",
    copy: "Follow the connection from supplier commitment to warehouse execution and the customer promise.",
  },
  {
    id: "warehouse",
    label: "Inside the warehouse",
    number: "02",
    title: "Go beyond the warehouse walls.",
    copy: "Lift the roof. Find the inventory. See the receiving and fulfillment work behind each order.",
  },
  {
    id: "transport",
    label: "Beyond the loading dock",
    number: "03",
    title: "The context travels with it.",
    copy: "The shipment remains linked to the customer order, the package, and the stock that made it possible.",
  },
] as const;

export function StoryExperience() {
  const scenario = useDemoStore((s) => s.scenario);
  const p = getPresentation(scenario);
  const [selectedView, setSelectedView] = useState(0);
  const [selectedStage, setSelectedStage] = useState(1);
  const scrollScene = useRef<HTMLElement>(null);
  const progress = useStoryProgress(scrollScene);
  const view = views[selectedView];
  const stage = stageDefinitions[selectedStage];
  const planMaximum = Math.max(
    p.forecast.forecastQty + p.forecast.targetEndingQty,
    p.available,
    1,
  );
  return (
    <div className="launch">
      <RouteViewport />
      <a className="launch-skip" href="#main">
        Skip to content
      </a>
      <header className="launch-header">
        <Link to="/" className="launch-brand" aria-label="CSCS SCOTI home">
          <img src="/brand/cscs-logo.svg" alt="CSCS" />
          <span />
          <b>
            SCOTI<sup>™</sup>
          </b>
        </Link>
        <nav aria-label="Story navigation">
          <a href="#platform">The platform</a>
          <a href="#journey">The journey</a>
          <a href="#operate">Try it yourself</a>
        </nav>
        <Link className="launch-header-cta" to="/demo/intro">
          Explore demo <span>↗</span>
        </Link>
      </header>
      <main id="main">
        <section className="launch-hero">
          <div className="hero-editorial">
            <p className="launch-eyebrow">
              <i /> THE CONNECTED SUPPLY CHAIN
            </p>
            <h1>
              See the whole.
              <br />
              Move as <em>one.</em>
            </h1>
            <p className="hero-description">
              Planning. Execution. Visibility.
              <br />
              Experience the connection with SCOTI<sup>™</sup>.
            </p>
            <div className="hero-links">
              <a className="launch-button" href="#platform">
                Enter the experience <span>↓</span>
              </a>
              <span>Explore in 5–10 minutes</span>
            </div>
          </div>
          <div className="hero-world">
            <div className="hero-coordinate">SCOTI™ / CONNECTED OPERATIONS</div>
            <SupplyWorld />
            <div className="world-tag world-tag--inventory">
              <i />
              <div>
                <span>WAREHOUSE INVENTORY</span>
                <strong>
                  {p.available}
                  <small> units available</small>
                </strong>
              </div>
              <span className="tag-trend">↗</span>
            </div>
            <div className="world-tag world-tag--shipment">
              <span className="tag-icon">↗</span>
              <div>
                <span>{p.shipment.id}</span>
                <strong>{p.shipment.status.replaceAll("_", " ")}</strong>
              </div>
            </div>
          </div>
          <div className="hero-baseline">
            <span>AN INTERACTIVE SCOTI™ MARKETING EXPERIENCE</span>
            <span>
              SCROLL TO CONNECT THE DOTS <b>↓</b>
            </span>
          </div>
        </section>
        <div
          className="launch-module-line"
          aria-label="Connected product areas"
        >
          <span>ONE OPERATING LAYER</span>
          <span>Demand & replenishment</span>
          <i />
          <span>Warehouse operations</span>
          <i />
          <span>Transportation</span>
          <i />
          <span>Connected visibility</span>
        </div>
        <section className="platform-explorer launch-section" id="platform">
          <div className="section-heading">
            <div>
              <p className="launch-eyebrow">01 / LOOK CLOSER</p>
              <h2>
                A supply chain.
                <br />
                <em>With nothing between the dots.</em>
              </h2>
            </div>
            <p>
              Explore the operations behind the overview. One connected scenario
              brings the physical journey and its information together.
            </p>
          </div>
          <div
            className="explorer-tabs"
            role="tablist"
            aria-label="Supply chain views"
          >
            {views.map((item, index) => (
              <button
                key={item.id}
                id={"view-tab-" + item.id}
                aria-controls="explorer-panel"
                role="tab"
                aria-selected={index === selectedView}
                onClick={() => setSelectedView(index)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    const next =
                      (index +
                        (event.key === "ArrowRight" ? 1 : -1) +
                        views.length) %
                      views.length;
                    setSelectedView(next);
                    document
                      .getElementById("view-tab-" + views[next].id)
                      ?.focus();
                  }
                }}
                tabIndex={index === selectedView ? 0 : -1}
              >
                <span>{item.number}</span>
                {item.label}
                <b>↗</b>
              </button>
            ))}
          </div>
          <div
            className="explorer-panel"
            id="explorer-panel"
            role="tabpanel"
            aria-labelledby={"view-tab-" + view.id}
          >
            <SupplyWorld view={view.id} roofOpen={view.id === "warehouse"} />
            <div className="explorer-annotation">
              <span className="launch-eyebrow">{view.number} / EXPLORER</span>
              <h3>{view.title}</h3>
              <p>{view.copy}</p>
              <div className="annotation-rule" />
              <span className="annotation-data">
                {view.id === "warehouse"
                  ? `${p.location.code} · ${p.inventory.onHand} on hand`
                  : view.id === "transport"
                    ? `${p.shipment.id} · ${p.shipment.status.replaceAll("_", " ")}`
                    : `${scenario.warehouses[0].name}`}
              </span>
            </div>
          </div>
        </section>

        <section className="planning-story" id="journey" ref={scrollScene}>
          <div className="planning-pin">
            <div className="planning-editorial">
              <p className="launch-eyebrow">02 / FROM SIGNAL TO DECISION</p>
              <h2>
                It starts with
                <br />a better view
                <br />
                <em>of what’s next.</em>
              </h2>
              <p>
                A Back-to-School promotion. A demand signal. A stock position
                that needs a plan.
              </p>
              <Link to="/demo/demand" className="launch-text-link">
                Explore Demand Planning <span>↗</span>
              </Link>
              <div className="planning-index">
                <span>FORECAST</span>
                <i />
                <span>INVENTORY</span>
                <i />
                <span>REPLENISH</span>
              </div>
            </div>
            <div
              className="planning-proof"
              style={{
                transform: `perspective(1200px) rotateY(${(1 - progress) * -8}deg) translateY(${(1 - progress) * 20}px)`,
              }}
            >
              <div className="proof-bar">
                <b>
                  SCOTI<sup>™</sup>
                </b>
                <span>DEMAND & REPLENISHMENT</span>
                <i />
              </div>
              <div className="proof-body">
                <div className="proof-title">
                  <div>
                    <span className="launch-eyebrow">
                      BACK-TO-SCHOOL / {scenario.metadata.heroSku}
                    </span>
                    <h3>Ahead of demand.</h3>
                  </div>
                  <span className="proof-period">AUG 2026</span>
                </div>
                <div className="proof-metric">
                  <strong>{p.forecast.forecastQty}</strong>
                  <span>
                    units forecast
                    <br />
                    for the promotion
                  </span>
                </div>
                <div className="proof-chart">
                  <div>
                    <span>Forecast + target</span>
                    <b>{p.forecast.forecastQty + p.forecast.targetEndingQty}</b>
                  </div>
                  <div className="proof-track">
                    <i
                      style={{
                        width: `${((p.forecast.forecastQty + p.forecast.targetEndingQty) / planMaximum) * 100}%`,
                      }}
                    />
                  </div>
                  <div>
                    <span>Available inventory</span>
                    <b>{p.available}</b>
                  </div>
                  <div className="proof-track proof-track--stock">
                    <i
                      style={{ width: `${(p.available / planMaximum) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="proof-equation">
                  <span>
                    {p.forecast.forecastQty}
                    <small>forecast</small>
                  </span>
                  <i>+</i>
                  <span>
                    {p.forecast.targetEndingQty}
                    <small>target</small>
                  </span>
                  <i>−</i>
                  <span>
                    {p.available}
                    <small>available</small>
                  </span>
                </div>
                <div className="proof-decision">
                  <span className="decision-symbol">↗</span>
                  <div>
                    <small>REPLENISHMENT REQUIREMENT</small>
                    <strong>{p.requirement} units</strong>
                  </div>
                  <span>
                    {p.requirement ? "Ready to plan" : "Stock covered"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ConnectedJourney />
        <WarehouseJourney />
        <section className="handoff-section launch-section">
          <div className="section-heading">
            <div>
              <p className="launch-eyebrow">03 / EVERY HANDOFF HAS CONTEXT</p>
              <h2>
                One story.
                <br />
                <em>All the way through.</em>
              </h2>
            </div>
            <p>
              Follow the seven connected stages. Each decision carries the same
              product, order, and customer promise forward.
            </p>
          </div>
          <div className="handoff-layout">
            <div
              className="handoff-list"
              role="group"
              aria-label="Explore journey stages"
            >
              {stageDefinitions.slice(1).map((item, i) => (
                <button
                  key={item.id}
                  aria-pressed={selectedStage === i + 1}
                  onClick={() => setSelectedStage(i + 1)}
                >
                  <span>0{i + 1}</span>
                  <strong>{item.label}</strong>
                  <b>↗</b>
                </button>
              ))}
            </div>
            <div className="handoff-detail" key={stage.id}>
              <span className="handoff-number">0{selectedStage}</span>
              <p className="launch-eyebrow">{stage.eyebrow}</p>
              <h3>{stage.purpose}</h3>
              <p>{stage.whyItMatters}</p>
              <div className="handoff-entities">
                <span>{scenario.metadata.heroSku}</span>
                <i>→</i>
                <span>
                  {selectedStage < 3
                    ? p.po.id
                    : selectedStage < 5
                      ? p.order.id
                      : p.shipment.id}
                </span>
              </div>
              <Link className="launch-text-link" to={"/demo" + stage.path}>
                Open {stage.shortLabel}
                <span>↗</span>
              </Link>
            </div>
          </div>
        </section>
        <section className="operate-section" id="operate">
          <div className="operate-heading">
            <p className="launch-eyebrow">04 / YOUR TURN</p>
            <h2>
              Make a move.
              <br />
              <em>See the connection.</em>
            </h2>
            <p>
              Run the scenario. Receive stock, allocate an order, and follow the
              shipment to delivery. Every view responds to your decisions.
            </p>
          </div>
          <div className="operate-layout">
            <div className="operate-world">
              <SupplyWorld
                view={p.received ? "transport" : "warehouse"}
                roofOpen={!p.received}
              />
              <div className="operate-legend">
                <span>
                  <i /> Shared scenario
                </span>
                <span>
                  {p.completed} of {p.total} decisions complete
                </span>
              </div>
            </div>
            <JourneyConsole />
          </div>
          <div className="operate-bottom">
            <span>Continue with the same scenario in the full workspace.</span>
            <Link to="/demo/control-tower">
              Open Control Tower <span>↗</span>
            </Link>
          </div>
        </section>
        <section className="launch-finale">
          <p className="launch-eyebrow">CSCS / SCOTI™</p>
          <h2>
            The whole chain.
            <br />
            <em>In your hands.</em>
          </h2>
          <div>
            <Link className="launch-button" to="/demo/intro">
              Enter the SCOTI demo <span>↗</span>
            </Link>
            <a
              className="launch-text-link"
              href="https://cscs.io/ai-supply-chain-platform/"
              target="_blank"
              rel="noreferrer"
            >
              Discover SCOTI at CSCS <span>↗</span>
            </a>
          </div>
          <span className="finale-thread" aria-hidden="true" />
        </section>
      </main>
      <footer className="launch-footer">
        <div>
          <img src="/brand/cscs-logo.svg" alt="CSCS" />
          <span>Connected from plan to delivery.</span>
          <a href="#main">Back to top ↑</a>
        </div>
        <DemoDisclosure />
      </footer>
    </div>
  );
}
