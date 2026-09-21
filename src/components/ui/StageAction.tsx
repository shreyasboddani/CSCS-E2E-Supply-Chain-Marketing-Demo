import { Button } from "./primitives";

interface StageActionProps {
  label: string;
  completedLabel: string;
  helper: string;
  completed: boolean;
  disabled?: boolean;
  onAction: () => void;
}

export function StageAction({
  label,
  completedLabel,
  helper,
  completed,
  disabled = false,
  onAction,
}: StageActionProps) {
  return (
    <div className={completed ? "stage-action stage-action--complete" : "stage-action"}>
      <div className="stage-action-copy">
        <span className="stage-action-kicker">GUIDED ACTION</span>
        <strong>{completed ? completedLabel : label}</strong>
        <span>{helper}</span>
      </div>
      <Button
        variant={completed ? "secondary" : "primary"}
        type="button"
        disabled={completed || disabled}
        onClick={onAction}
      >
        {completed ? "Completed" : label}
      </Button>
    </div>
  );
}
