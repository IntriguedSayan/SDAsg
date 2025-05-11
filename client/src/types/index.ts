export type Orientation = "north" | "south" | "east" | "west";

export interface Facade {
  orientation: Orientation;
  height: number;
  width: number;
  wwr: number;
}

export interface Skylight {
  height: number;
  width: number;
}

export interface BuildingInput {
  name: string;
  city: string;
  shgc: number;
  cop: number;
  facades: Facade[];
  skylight?: Skylight;
}

export interface AnalysisResult {
  status: number;
  analyzedData: {
    totalHeatGain: number;
    coolingLoad: number;
    energyConsumed: number;
    cost: number;
  };
  radiation: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}
