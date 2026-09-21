import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { getCurrentScenarioDate, getJourneyProgress } from "../domain/selectors";
import { stageDefinitions } from "../narrative/stageCopy";
import { useDemoStore } from "../store/demoStore";
import { JourneyProgress } from "../components/ui/JourneyProgress";
import { DemoDisclosure } from "../components/ui/DemoDisclosure";
import { Button, Modal } from "../components/ui/primitives";
import { formatScenarioDate } from "../utils/dates";

export function DemoShell() {
  const scenario = useDemoStore((state) => state.scenario);
  const mode = useDemoStore((state) => state.mode);
  const setMode = useDemoStore((state) => state.setMode);
  const resetScenario = useDemoStore((state) => state.resetScenario);
  const [resetOpen, setResetOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const progress = getJourneyProgress(scenario);
  const activeStage = stageDefinitions.find((stage) => stage.path === location.pathname)?.id ?? "intro";
  const scenarioDate = formatScenarioDate(getCurrentScenarioDate(scenario));

  const closeResetDialog = () => setResetOpen(false);
  const confirmReset = () => {
    resetScenario();
    setResetOpen(false);
    navigate("/intro");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/intro" className="brand-lockup" aria-label="TrailSip concept demo home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span className="brand-copy"><strong>TRAILSIP</strong><small>SUPPLY CHAIN CONCEPT</small></span>
        </Link>
        <div className="topbar-context">
          <span className="context-label">SCENARIO</span>
          <strong>{scenario.metadata.name}</strong>
          <span className="context-divider" />
          <span>{scenarioDate}</span>
        </div>
        <div className="topbar-actions">
          <div className="mode-switch" aria-label="Navigation mode">
            <button type="button" aria-pressed={mode === "guided"} onClick={() => setMode("guided")}>Guided</button>
            <button type="button" aria-pressed={mode === "explore"} onClick={() => setMode("explore")}>Explore</button>
          </div>
          <Button variant="quiet" className="reset-button" onClick={() => setResetOpen(true)}>
            <span className="reset-icon" aria-hidden="true">↺</span> Reset demo
          </Button>
        </div>
      </header>

      <div className="shell-body">
        <aside className="sidebar">
          <div className="workspace-label"><span className="workspace-mark">TS</span><div><strong>{scenario.metadata.company} Ops</strong><small>DEMO WORKSPACE</small></div></div>
          <JourneyProgress completedStages={progress.completedStages} />
          <div className="sidebar-bottom">
            <span className="sidebar-scenario-label">SCENARIO SCOPE</span>
            <p>{scenario.warehouses.length} warehouse <i /> {scenario.products.length} products</p>
            <p>{scenario.suppliers.length} supplier <i /> {scenario.customers.length} customer</p>
            <div className="offline-label"><span className="offline-dot" /> Local scenario data</div>
          </div>
        </aside>

        <div className="workspace">
          <motion.div
            key={location.pathname}
            className="route-view"
            initial={reduceMotion ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
          <footer className="app-footer"><DemoDisclosure /></footer>
        </div>
      </div>

      <Modal
        open={resetOpen}
        title="Reset this demo?"
        description="This restores the exact initial TrailSip scenario and clears any progress saved in this browser session."
        onClose={closeResetDialog}
      >
        <Button variant="primary" onClick={confirmReset}>Reset to start</Button>
      </Modal>
      <span className="sr-only" aria-live="polite">Current stage: {stageDefinitions.find((stage) => stage.id === activeStage)?.label}</span>
    </div>
  );
}
