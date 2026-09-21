import { getStageDefinition } from "../../narrative/stageCopy";
import type { StageId } from "../../domain/types";
import { StatusBadge } from "./primitives";

export function StageHeader({ stageId }: { stageId: StageId }) {
  const stage = getStageDefinition(stageId);
  return (
    <header className="stage-header">
      <div>
        <div className="stage-eyebrow">{stage.eyebrow}<span className="stage-divider">/</span> SCOTI™ CONCEPT DEMO</div>
        <h1>{stage.label}</h1>
        <p>{stage.purpose}</p>
      </div>
      <StatusBadge status="SIMULATED" label="SIMULATED DATA" />
    </header>
  );
}
