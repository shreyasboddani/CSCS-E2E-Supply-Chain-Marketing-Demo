import { useRef, type ReactNode } from "react";
import { useStoryProgress } from "./useStoryProgress";

interface StorySceneProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  copy: string;
  children: (progress: number) => ReactNode;
  className?: string;
}

export function StoryScene({ id, eyebrow, title, copy, children, className = "" }: StorySceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useStoryProgress(sectionRef);
  return (
    <section ref={sectionRef} id={id} className={"story-scene " + className}>
      <div className="story-scene__pin">
        <div className="story-scene__copy">
          <p className="story-kicker">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{copy}</p>
        </div>
        <div className="story-scene__visual" aria-hidden="true">{children(progress)}</div>
      </div>
    </section>
  );
}
