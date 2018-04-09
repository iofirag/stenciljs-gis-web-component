import L from "leaflet";
import { MeasureConfig, MeasureOptions } from "../../../../../models";
export declare class MeasurePlugin {
    compName: string;
    config: MeasureConfig;
    gisMap: L.Map;
    control: L.Control;
    getControl(): L.Control;
    constructor();
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    private createPlugin(options);
    private fromGlobalUnitToPluginUnit(globalUnit);
    private fromGlobalUnitToButtonUnit(globalUnit);
    private changePluginUnits(globalUnit);
}
export declare type PolylineMeasureOptions_Dev = MeasureOptions & {
    showUnitControl: boolean;
    unit: string;
};
