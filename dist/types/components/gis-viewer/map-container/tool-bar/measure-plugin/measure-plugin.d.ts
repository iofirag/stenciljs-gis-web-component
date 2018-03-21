import L from "leaflet";
import { MeasureConfig, DistanceUnitType, MeasureOptions } from "../../../../../models";
export declare class MeasurePlugin {
    compName: string;
    config: MeasureConfig;
    gisMap: L.Map;
    distanceUnitType: DistanceUnitType;
    control: L.Control;
    watchDistanceUnitType(newValue: DistanceUnitType): void;
    getControl(): L.Control;
    private fromGlobalUnitToPluginUnit(globalUnit);
    private fromGlobalUnitToButtonUnit(globalUnit);
    private changePluginUnits(globalUnit);
    componentDidLoad(): void;
    componentDidUnload(): void;
    private createPlugin(options);
}
export declare type PolylineMeasureOptions_Dev = MeasureOptions & {
    showUnitControl: boolean;
    unit: string;
};
