import { Link } from "react-router-dom";
import { getNextStage, getStageDefinition } from "../../narrative/stageCopy";
import type { DemoScenario, StageId } from "../../domain/types";
import { OperationalId, StatusBadge } from "../ui/primitives";
import { formatScenarioDate } from "../../utils/dates";
import {
  getHeroOrder,
  getHeroPurchaseOrder,
  getHeroShipment,
  getCurrentScenarioDate,
} from "../../domain/selectors";

export function NarrativeRail({ stageId, scenario, pathPrefix = "" }: { stageId: StageId; scenario: DemoScenario; pathPrefix?: string }) {
  const stage = getStageDefinition(stageId);
  const nextStage = getNextStage(stageId);
  const order = getHeroOrder(scenario);
  const purchaseOrder = getHeroPurchaseOrder(scenario);
  const shipment = getHeroShipment(scenario);
  const scenarioDate = formatScenarioDate(getCurrentScenarioDate(scenario));

  return (
    <aside className="story-rail" aria-label="Stage narrative">
      <div className="story-rail-heading">
        <span className="story-rail-kicker">STORY CONTEXT</span>
        <span className="story-rail-index">{stage.eyebrow}</span>
      </div>
      <div className="story-block">
        <span className="story-label">What happened</span>
        <p>{stage.whatHappened}</p>
      </div>
      <div className="story-block">
        <span className="story-label">Why it matters</span>
        <p>{stage.whyItMatters}</p>
      </div>
      <div className="story-next">
        <span className="story-label">Connection</span>
        <p>{stage.nextConnection}</p>
        {nextStage && (
          <Link className="story-link" to={pathPrefix + nextStage.path}>
            Continue to {nextStage.shortLabel} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
      <div className="story-entities">
        <span className="story-label">Hero entities</span>
        <div className="entity-stack">
          <Link to={pathPrefix + "/sourcing"}><OperationalId>{purchaseOrder?.id ?? "—"}</OperationalId><StatusBadge status={purchaseOrder?.status ?? "DRAFT"} /></Link>
          <Link to={pathPrefix + "/orders"}><OperationalId>{order?.id ?? "—"}</OperationalId><StatusBadge status={order?.status ?? "NEW"} /></Link>
          <Link to={pathPrefix + "/shipment"}><OperationalId>{shipment?.id ?? "—"}</OperationalId><StatusBadge status={shipment?.status ?? "PLANNED"} /></Link>
        </div>
      </div>
      <div className="scenario-date">
        <span className="status-indicator status-indicator--outline" aria-hidden="true" />
        Scenario date <strong>{scenarioDate}</strong>
      </div>
    </aside>
  );
}
