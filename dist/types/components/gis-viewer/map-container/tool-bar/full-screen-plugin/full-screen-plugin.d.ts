import L from "leaflet";
import { FullScreenConfig } from "../../../../../models";
export declare class FullScreenPlugin {
    compName: string;
    config: FullScreenConfig;
    gisMap: L.Map;
    control: L.Control;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    getControl(): L.Control;
    private createPlugin();
    buttonClickHandler(): void;
}
