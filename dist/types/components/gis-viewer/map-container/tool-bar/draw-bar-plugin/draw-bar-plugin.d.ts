import { DrawBarConfig, DistanceUnitType } from "../../../../../models";
import L from "leaflet";
export declare class DrawBarPlugin {
    compName: string;
    config: DrawBarConfig;
    gisMap: L.Map;
    distanceUnitType: DistanceUnitType;
    control: L.Control;
    drawnLayer: L.FeatureGroup;
    getControl(): L.Control;
    componentDidLoad(): void;
    componentDidUnload(): void;
}
