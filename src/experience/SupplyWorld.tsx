import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { SceneState } from "./three/createSupplyScene";
import { useDemoStore } from "../store/demoStore";
import { getPresentation } from "../domain/presentation";

export function SupplyWorld({
  view = "network",
  interactive = true,
  roofOpen = false,
  progress,
  chapter,
  operationsFocus,
}: {
  view?: SceneState["view"];
  interactive?: boolean;
  roofOpen?: boolean;
  progress?: number;
  chapter?: number;
  operationsFocus?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<
    typeof import("./three/createSupplyScene").createSupplyScene
  > | null>(null);
  const scenario = useDemoStore((s) => s.scenario);
  const p = getPresentation(scenario);
  const reduced = useReducedMotion();
  const [renderState, setRenderState] = useState<
    "loading" | "ready" | "fallback"
  >("loading");
  const current = useRef<SceneState>({
    view,
    roofOpen,
    received: p.received,
    shipmentProgress: p.shipmentProgress,
    motion: !reduced,
    operationsFocus,
    operationsCompleted: p.completed,
  });
  useEffect(() => {
    current.current = {
      view,
      roofOpen,
      received: p.received,
      shipmentProgress: p.shipmentProgress,
      motion: !reduced,
      progress,
      chapter,
      operationsFocus,
      operationsCompleted: p.completed,
    };
    controller.current?.update(current.current);
  }, [view, roofOpen, p.received, p.shipmentProgress, p.completed, reduced, progress, chapter, operationsFocus]);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let disposed = false;
    let started = false;
    const lost = (event: Event) => {
      event.preventDefault();
      controller.current?.dispose();
      controller.current = null;
      setRenderState("fallback");
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        void import("./three/createSupplyScene")
          .then(({ createSupplyScene }) => {
            if (disposed) return;
            try {
              controller.current = createSupplyScene(node, current.current);
              node
                .querySelector("canvas")
                ?.addEventListener("webglcontextlost", lost);
              setRenderState("ready");
            } catch {
              setRenderState("fallback");
            }
          })
          .catch(() => {
            if (!disposed) setRenderState("fallback");
          });
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => {
      disposed = true;
      observer.disconnect();
      node
        .querySelector("canvas")
        ?.removeEventListener("webglcontextlost", lost);
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);

  return (
    <div className={"supply-world supply-world--" + renderState}>
      <div className="world-ground" />
      {renderState !== "ready" && (operationsFocus !== undefined ? <OperationsFallback focus={operationsFocus} /> : <WorldFallback />)}
      <div className="world-canvas" ref={host} aria-hidden="true" />
      <div className="world-caption">
        <span className="world-signal" />
        <span>
          {operationsFocus !== undefined ? "DISTRIBUTION FLOOR / ILLUSTRATIVE" : view === "warehouse"
            ? "WAREHOUSE / A-03-02"
            : view === "transport"
              ? "TRANSPORT / SHP-1001"
              : "CONNECTED OPERATIONS"}
        </span>
        <span className="world-caption-right">ILLUSTRATIVE MODEL</span>
      </div>
      {interactive && renderState === "ready" && (
        <div className="world-controls">
          <span>Drag to explore</span>
          <button
            aria-label="Rotate model left"
            onClick={() => controller.current?.rotate(-1)}
          >
            ↶
          </button>
          <button
            aria-label="Rotate model right"
            onClick={() => controller.current?.rotate(1)}
          >
            ↷
          </button>
        </div>
      )}
      <span className="sr-only">
        Illustrative supply-chain model. {scenario.warehouses[0].name}:{" "}
        {p.inventory.onHand} units on hand, {p.available} available. Shipment{" "}
        {p.shipment.status.replaceAll("_", " ")}.
      </span>
    </div>
  );
}

function OperationsFallback({ focus }: { focus: number }) {
  return <svg className="world-fallback" viewBox="0 0 900 580" role="img" aria-label="Distribution floor: receiving, storage, packing, and dispatch">
    <path d="M70 305 485 100 835 300 420 515Z" fill="#d7e5f1" />
    <path d="M70 305v20l350 210v-20Zm350 210v20l415-215v-20Z" fill="#b8ccdf" />
    {[0, 1, 2, 3].map(i => <g key={i} transform={`translate(${175 + i * 142},${290 - i * 20})`}>
      <path d="M0 0 72-38 150 5 76 45Z" fill={focus === i ? "#00a995" : "#c2d5e8"} />
      <path d="M25-10v-65l47-24 54 29v65L79 22Z" fill="#eaf2fa" stroke="#6084ab" strokeWidth="2" />
      <path d="M25-75 72-99 126-70 79-45Z" fill="#fff" />
      <path d="M79-45v67M25-40 79-10 126-35" fill="none" stroke="#3a78ff" strokeWidth="5" />
      <text x="70" y="86" textAnchor="middle" fill="#284a70" fontSize="16">{["Receive", "Store", "Pack", "Dispatch"][i]}</text>
    </g>)}
  </svg>;
}

function WorldFallback() {
  const id = useId();
  return (
    <svg
      className="world-fallback"
      viewBox="0 0 900 580"
      role="img"
      aria-label="Warehouse connected to supplier and delivery locations"
    >
      <defs>
        <linearGradient id={id + '-slab'} x2="0" y2="1">
          <stop stopColor="#e6edf5" />
          <stop offset="1" stopColor="#b4c9dd" />
        </linearGradient>
        <linearGradient id={id + '-roof'}>
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#deebf7" />
        </linearGradient>
      </defs>
      <path d="M70 325 480 105 842 303 430 537Z" fill={'url(#' + id + '-slab)'} />
      <path
        d="M70 325V342L430 554V537ZM430 537V554L842 320V303Z"
        fill="#bdcfdf"
      />
      <path d="M110 339 443 520 800 319 474 143Z" fill="#f4f8fc" />
      <path
        d="M122 354 435 516 784 317"
        fill="none"
        stroke="#91aec9"
        strokeWidth="24"
      />
      <path
        d="M122 354 435 516 784 317"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeDasharray="10 12"
      />
      <path d="M260 302V208L480 92 658 186V291L440 411Z" fill="#c9ddeb" />
      <path d="M260 208 480 92 658 186 440 310Z" fill={'url(#' + id + '-roof)'} />
      <path d="M440 310 658 186V291L440 411Z" fill="#eaf2f8" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={"translate(" + i * 34 + " " + i * 18 + ")"}>
          <path d="M282 207 478 103 492 111 296 216Z" fill="#3a6d9d" />
          <path d="M282 212 478 108" stroke="#b7dbfa" strokeWidth="2" />
        </g>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={"translate(" + i * 45 + " " + i * -25 + ")"}>
          <path d="M456 337 482 322V373L456 388Z" fill="#567899" />
          <path d="M451 391 483 374 501 384 470 402Z" fill="#94b0c9" />
        </g>
      ))}
      <path
        d="M180 304 310 385 453 460 743 305"
        fill="none"
        stroke="#377dff"
        strokeWidth="4"
      />
      <g fill="#eef5fb" stroke="#90b4d5">
        <path d="M165 295V241L221 212 263 235V288L207 319Z" />
        <path d="M681 283V222L717 203 758 225V284L722 305Z" />
      </g>
      <g fill="#12aa9d">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <ellipse key={i} cx={255 + i * 25} cy={442 + i * 13} rx="9" ry="14" />
        ))}
      </g>
    </svg>
  );
}
