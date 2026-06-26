import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from "react-leaflet";
import { CandidateDestination } from "../lib/types";

type LocationGroup = {
  location: string;
  lat: number;
  lng: number;
  candidates: CandidateDestination[];
  hasSelected: boolean;
};

export function DestinationMap({
  allCandidates,
  selectedIds,
}: {
  allCandidates: CandidateDestination[];
  selectedIds: Set<string>;
}) {
  const { locationGroups, unmappedCount, coveredRegions } = useMemo(() => {
    const groups = new Map<string, CandidateDestination[]>();
    let unmappedCount = 0;

    for (const c of allCandidates) {
      if (c.lat != null && c.lng != null) {
        const list = groups.get(c.location);
        if (list) list.push(c);
        else groups.set(c.location, [c]);
      } else {
        unmappedCount++;
      }
    }

    const locationGroups: LocationGroup[] = [];
    const coveredLocations = new Set<string>();

    for (const [location, candidates] of groups) {
      const first = candidates[0];
      const hasSelected = candidates.some((c) => selectedIds.has(c.id));
      if (hasSelected) coveredLocations.add(location);
      locationGroups.push({
        location,
        lat: first.lat!,
        lng: first.lng!,
        candidates,
        hasSelected,
      });
    }

    return { locationGroups, unmappedCount, coveredRegions: coveredLocations.size };
  }, [allCandidates, selectedIds]);

  const getRadius = (count: number) => Math.max(6, Math.min(18, 6 + count * 2));

  const center: [number, number] = [34, 108];
  const bounds: [[number, number], [number, number]] = [
    [16, 73],
    [54, 135],
  ];

  return (
    <div className="zh-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm" style={{ color: "#1F2D3D" }}>目的地地图</h3>
        {unmappedCount > 0 && (
          <span className="text-xs" style={{ color: "#8A9AA8" }}>未定位 {unmappedCount} 个</span>
        )}
      </div>
      <div className="rounded-lg overflow-hidden" style={{ height: 420 }}>
        <MapContainer
          center={center}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          maxBounds={bounds}
          minZoom={4}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locationGroups.map((g) => (
            <CircleMarker
              key={g.location}
              center={[g.lat, g.lng]}
              radius={getRadius(g.candidates.length)}
              pathOptions={{
                color: g.hasSelected ? "#174A7C" : "#8A9AA8",
                fillColor: g.hasSelected ? "#174A7C" : "#C8D0D8",
                fillOpacity: g.hasSelected ? 0.9 : 0.4,
                weight: g.hasSelected ? 2 : 1,
                opacity: g.hasSelected ? 1 : 0.5,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                <div style={{ fontWeight: 600, color: "#1F2D3D", fontSize: 12 }}>{g.location}</div>
                <div style={{ color: "#6B7C8F", fontSize: 11 }}>
                  {g.candidates.length} 个目的地
                  {g.hasSelected && `（${g.candidates.filter((c) => selectedIds.has(c.id)).length} 个候选）`}
                </div>
              </Tooltip>
              <Popup>
                <div className="text-xs" style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700, color: "#1F2D3D", fontSize: 13, marginBottom: 4 }}>
                    {g.location}
                  </div>
                  <div style={{ color: "#6B7C8F", marginBottom: 6 }}>
                    共 {g.candidates.length} 个目的地
                  </div>
                  <div style={{ maxHeight: 200, overflowY: "auto" }}>
                    {g.candidates.map((c) => {
                      const isSel = selectedIds.has(c.id);
                      return (
                        <div
                          key={c.id}
                          style={{
                            padding: "2px 0",
                            color: isSel ? "#174A7C" : "#4A5A6A",
                            fontWeight: isSel ? 600 : 400,
                          }}
                        >
                          {isSel ? "✓ " : "  "}
                          {c.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs" style={{ color: "#6B7C8F" }}>
        <span>全部目的地：{allCandidates.length}</span>
        <span>地图点位：{locationGroups.length}</span>
        <span>当前候选目的地：{selectedIds.size}</span>
        <span>候选覆盖地区：{coveredRegions}</span>
      </div>
    </div>
  );
}
