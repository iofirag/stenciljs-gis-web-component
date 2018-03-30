import L from "leaflet";
import { MouseCoordinateConfig } from "../../../../models";
export declare class MouseCoordinagePlugin {
    compName: string;
    config: MouseCoordinateConfig;
    gisMap: L.Map;
    controlGps: L.Control;
    controlUtm: L.Control;
    controlUtmref: L.Control;
    constructor();
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    private createPlugin(options);
    private changeCoordinateSystemHandler(value);
}
