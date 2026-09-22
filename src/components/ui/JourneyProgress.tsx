import { NavLink } from "react-router-dom";
import { stageDefinitions } from "../../narrative/stageCopy";
import type { StageId } from "../../domain/types";

export function JourneyProgress({ completedStages, pathPrefix = "" }: { completedStages: StageId[]; pathPrefix?: string }) {
  return (
    <nav className="journey-nav" aria-label="Demo stages">
      <div className="journey-nav-heading">
        <span className="eyebrow">JOURNEY MAP</span>
        <span className="journey-nav-count">{String(stageDefinitions.length).padStart(2, "0")} STAGES</span>
      </div>
      <ol className="journey-list">
        {stageDefinitions.map((stage, index) => (
          <li key={stage.id} className={completedStages.includes(stage.id) ? "journey-item journey-item--complete" : "journey-item"}>
            <NavLink
              to={pathPrefix + stage.path}
              end
              className={({ isActive }) => isActive ? "journey-link journey-link--active" : "journey-link"}
              aria-label={(index + 1) + ". " + stage.label}
            >
              <span className="journey-step" aria-hidden="true">
                {completedStages.includes(stage.id) ? <span className="journey-check">✓</span> : String(index + 1).padStart(2, "0")}
              </span>
              <span className="journey-label">{stage.shortLabel}</span>
              <span className="journey-chevron" aria-hidden="true">›</span>
            </NavLink>
          </li>
        ))}
      </ol>
      <div className="journey-caption">
        <span className="thread-swatch" aria-hidden="true" />
        <span>Connected scenario</span>
      </div>
    </nav>
  );
}
