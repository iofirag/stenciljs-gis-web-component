import { DrawBarConfig } from "../../../../../models";
import L from "leaflet";
export declare class DrawBarPlugin {
    compName: string;
    config: DrawBarConfig;
    gisMap: L.Map;
    control: L.Control;
    drawnLayer: L.FeatureGroup;
    getControl(): L.Control;
    constructor();
    componentDidLoad(): void;
    componentDidUnload(): void;
}
