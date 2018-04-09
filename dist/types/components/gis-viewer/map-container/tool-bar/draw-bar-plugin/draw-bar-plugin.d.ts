import { DrawBarConfig } from "../../../../../models";
import L from "leaflet";
export declare class DrawBarPlugin {
    compName: string;
    config: DrawBarConfig;
    gisMap: L.Map;
    control: L.Control;
    drawnLayer: L.FeatureGroup;
    layerManagerEl: HTMLLayerManagerPluginElement;
    getControl(): L.Control;
    constructor();
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
}
