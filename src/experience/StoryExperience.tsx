import { Link, useNavigate } from "react-router-dom";
import { useDemoStore } from "../store/demoStore";
import { calculateReplenishmentRequirement, getHeroForecast, getHeroInventory, getHeroShipment } from "../domain/selectors";
import { DemoDisclosure } from "../components/ui/DemoDisclosure";
import { FragmentNetwork, PlanningSurface, RouteScene, TowerScene, WarehouseScene } from "./StoryVisuals";
import { StoryScene } from "./StoryScene";

export function StoryExperience() {
  const navigate = useNavigate();
  const scenario = useDemoStore((state) => state.scenario);
  const forecast = getHeroForecast(scenario);
  const inventory = getHeroInventory(scenario);
  const shipment = getHeroShipment(scenario);
  const requirement = forecast && inventory ? calculateReplenishmentRequirement(forecast, inventory) : 0;
  const receiptPosted = scenario.goodsReceipts.some((receipt) => receipt.status === "POSTED");

  return <main className="experience" id="top">
    <header className="experience-header">
      <Link to="/" className="experience-brand" aria-label="CSCS SCOTI concept story home"><img src="/brand/cscs-logo.svg" alt="CSCS" /><span /><strong>SCOTI<sup>™</sup></strong></Link>
      <nav aria-label="Story navigation"><a href="#platform">Platform</a><a href="#journey">Journey</a><a href="#orchestrate">Orchestration</a></nav>
      <button type="button" className="experience-header__cta" onClick={() => navigate("/demo/intro")}>Explore demo <span>→</span></button>
    </header>

    <section className="experience-hero">
      <div className="hero-grain" />
      <p className="story-kicker">CSCS / SCOTI™ CONCEPT EXPERIENCE</p>
      <h1>Every handoff,<br /><em>one connected story.</em></h1>
      <p className="experience-hero__lede">A simulated retail operation, from a demand signal to delivery visibility.</p>
      <a href="#platform" className="scroll-invitation"><i /> Enter the connected supply chain</a>
      <FragmentNetwork progress={0.62} />
    </section>

    <StoryScene id="platform" eyebrow="01 / THE CONNECTED LAYER" title={<>Operations begin apart.<br /><em>SCOTI brings the thread.</em></>} copy="Planning, warehouse operations, transportation, and visibility are presented as one continuous operational story.">
      {(progress) => <FragmentNetwork progress={progress} />}
    </StoryScene>

    <StoryScene id="journey" className="story-scene--planning" eyebrow="02 / PLANNING INTO ACTION" title={<>The signal is clear.<br /><em>The next move is connected.</em></>} copy="The Back-to-School forecast, stock position, and target ending inventory expose a shared replenishment requirement.">
      {(progress) => <PlanningSurface progress={progress} requirement={requirement} />}
    </StoryScene>

    <StoryScene id="warehouse" className="story-scene--warehouse" eyebrow="03 / WAREHOUSE EXECUTION" title={<>A physical handoff,<br /><em>still part of the same system.</em></>} copy="Receipt RCPT-1001 connects the supplier commitment to location A-03-02 at East Distribution Center.">
      {(progress) => <WarehouseScene progress={progress} received={receiptPosted} />}
    </StoryScene>

    <StoryScene id="movement" className="story-scene--movement" eyebrow="04 / MOVEMENT & VISIBILITY" title={<>The order leaves the warehouse.<br /><em>The context travels with it.</em></>} copy="ORD-1001, PKG-1001, and SHP-1001 remain linked through the simulated delivery milestones.">
      {(progress) => <RouteScene progress={progress} shipmentStatus={shipment?.status ?? "PLANNED"} />}
    </StoryScene>

    <StoryScene id="orchestrate" className="story-scene--tower" eyebrow="05 / ORCHESTRATION" title={<>See the whole chain.<br /><em>Then operate it.</em></>} copy="The same scenario state now becomes an interactive workspace: every action updates the connected views.">
      {(progress) => <TowerScene progress={progress} eventCount={scenario.activityEvents.length} />}
    </StoryScene>

    <section className="sandbox-gateway">
      <div className="sandbox-gateway__surface"><span className="gateway-window-dot" /><span className="gateway-window-dot" /><span className="gateway-window-dot" /><div className="gateway-workspace"><p className="story-kicker">SCOTI™ CONCEPT WORKSPACE</p><h2>Now operate the<br />connected story.</h2><p>Explore the real, deterministic scenario and watch each shared handoff update.</p><button type="button" onClick={() => navigate("/demo/intro")}>Enter the SCOTI demo <span>→</span></button></div><div className="gateway-thread" /></div>
    </section>
    <footer className="experience-footer"><DemoDisclosure /></footer>
  </main>;
}
