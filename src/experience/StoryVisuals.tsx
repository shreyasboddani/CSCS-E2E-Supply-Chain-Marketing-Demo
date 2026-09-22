import type { CSSProperties } from "react";

const style = (properties: Record<string, string | number>): CSSProperties => properties as CSSProperties;

export function FragmentNetwork({ progress }: { progress: number }) {
  const connection = Math.min(1, progress * 1.65);
  return <div className="network-stage" style={style({ "--progress": progress, "--connection": connection })}>
    <span className="network-orbit network-orbit--one" /><span className="network-orbit network-orbit--two" />
    <svg className="network-lines" viewBox="0 0 900 520" preserveAspectRatio="none">
      <path className="thread-path" pathLength="1" d="M148 118 C290 95 307 262 449 260 S620 136 756 165 M142 385 C275 367 320 281 449 260 S625 388 774 360" />
    </svg>
    <NetworkNode label="Planning" icon="ƒ" className="network-node--plan" />
    <NetworkNode label="Warehouse" icon="□" className="network-node--warehouse" />
    <NetworkNode label="Transport" icon="→" className="network-node--transport" />
    <NetworkNode label="Visibility" icon="◌" className="network-node--visibility" />
    <div className="network-core"><span>SCOTI<sup>™</sup></span><small>connected operating layer</small></div>
  </div>;
}

function NetworkNode({ label, icon, className }: { label: string; icon: string; className: string }) {
  return <div className={"network-node-story " + className}><i>{icon}</i><span>{label}</span></div>;
}

export function PlanningSurface({ progress, requirement }: { progress: number; requirement: number }) {
  const reveal = Math.min(1, progress * 1.6);
  return <div className="planning-stage" style={style({ "--progress": progress, "--reveal": reveal })}>
    <div className="signal-axis"><span>0</span><span>60</span><span>120</span></div>
    <div className="forecast-arc"><span className="forecast-arc__fill" /><b>Forecast / 120</b></div>
    <div className="inventory-line"><span /><b>Available / 40</b></div>
    <div className="decision-chip"><small>REPLENISHMENT SIGNAL</small><strong>{requirement} units</strong><span>Target ending stock / 20</span></div>
    <span className="planning-thread" />
  </div>;
}

export function WarehouseScene({ progress, received }: { progress: number; received: boolean }) {
  const inventoryLabel = received ? "140 units on hand" : "100 units expected";
  return <div className="warehouse-stage" style={style({ "--progress": progress })}>
    <div className="warehouse-horizon" />
    <div className="warehouse-roof" /><div className="warehouse-wall warehouse-wall--left" /><div className="warehouse-wall warehouse-wall--right" />
    <div className="warehouse-floor" />
    <div className="warehouse-racks"><Rack index="01" /><Rack index="02" /><Rack index="03" active /><Rack index="04" /></div>
    <div className="warehouse-dock"><span>INBOUND</span><i>+100</i></div>
    <div className="warehouse-callout"><small>A-03-02</small><strong>{inventoryLabel}</strong></div>
    <span className="warehouse-thread" />
  </div>;
}

function Rack({ index, active = false }: { index: string; active?: boolean }) {
  return <div className={"warehouse-rack " + (active ? "warehouse-rack--active" : "")}><span>{index}</span><i /><i /><i /><i /></div>;
}

export function RouteScene({ progress, shipmentStatus }: { progress: number; shipmentStatus: string }) {
  const active = shipmentStatus !== "PLANNED";
  return <div className="route-stage" style={style({ "--progress": progress, "--active": active ? 1 : 0 })}>
    <div className="map-field"><i /><i /><i /><i /></div>
    <svg className="route-path" viewBox="0 0 900 460" preserveAspectRatio="none"><path pathLength="1" d="M108 357 C235 277 307 303 420 232 S609 73 792 107" /></svg>
    <div className="route-terminal route-terminal--origin"><small>EDC</small><b>East DC</b></div>
    <div className="route-terminal route-terminal--destination"><small>DELIVERY</small><b>Alex Morgan</b></div>
    <div className="route-vehicle">→</div>
    <div className="route-status"><span>Shipment</span><strong>{shipmentStatus.replaceAll("_", " ")}</strong></div>
  </div>;
}

export function TowerScene({ progress, eventCount }: { progress: number; eventCount: number }) {
  return <div className="tower-stage" style={style({ "--progress": progress })}>
    <svg className="tower-connections" viewBox="0 0 960 540" preserveAspectRatio="none">
      <path pathLength="1" d="M150 134 L468 266 L808 124 M150 400 L468 266 L815 400 M468 266 L468 455" />
    </svg>
    <TowerNode label="Demand" className="tower-node--demand" /><TowerNode label="Warehouse" className="tower-node--warehouse" /><TowerNode label="Shipment" className="tower-node--shipment" /><TowerNode label="Customer" className="tower-node--customer" /><TowerNode label="Activity" className="tower-node--activity" />
    <div className="tower-core-story"><small>CONNECTED STORY</small><strong>SCOTI<sup>™</sup></strong><span>{eventCount} recorded events</span></div>
  </div>;
}

function TowerNode({ label, className }: { label: string; className: string }) { return <div className={"tower-node-story " + className}><i /><span>{label}</span></div>; }
