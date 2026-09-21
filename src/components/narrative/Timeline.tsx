import type { ActivityEvent } from "../../domain/types";
import { OperationalId } from "../ui/primitives";

const formatTimestamp = (timestamp: string): string =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(timestamp));

export function Timeline({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="timeline-empty">
        <span className="timeline-empty-line" aria-hidden="true" />
        <div>
          <strong>Activity begins with the demand decision.</strong>
          <p>Scenario events will populate this shared timeline as stage transitions are added.</p>
        </div>
      </div>
    );
  }

  return (
    <ol className="timeline">
      {events.map((event) => (
        <li className="timeline-item" key={event.id}>
          <TimelineNode />
          <div className="timeline-content">
            <div className="timeline-meta"><span>{formatTimestamp(event.timestamp)} UTC</span><span>{event.stage.replace("-", " ")}</span></div>
            <p>{event.message}</p>
            <OperationalId>{event.entityId}</OperationalId>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function TimelineNode() {
  return <span className="timeline-node" aria-hidden="true" />;
}
