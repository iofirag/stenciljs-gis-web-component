import L from "leaflet";
import { MouseCoordinateConfig, CoordinateSystemType } from "../../../../models";
export declare class MouseCoordinagePlugin {
    compName: string;
    config: MouseCoordinateConfig;
    gisMap: L.Map;
    coordinateSystemType: CoordinateSystemType;
    controlGps: L.Control;
    controlUtm: L.Control;
    controlUtmref: L.Control;
    watchCoordinateSystemType(newValue: string): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    private createPlugin(options);
    private changeCoordinateSystemHandler(value);
}
