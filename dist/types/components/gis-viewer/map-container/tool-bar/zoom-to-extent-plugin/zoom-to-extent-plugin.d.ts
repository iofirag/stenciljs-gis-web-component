import { EventEmitter } from "../../../../../stencil.core";
import L from 'leaflet';
import { ZoomToExtentConfig } from "../../../../../models";
export declare class ZoomToExtentPlugin {
    compName: string;
    config: ZoomToExtentConfig;
    gisMap: L.Map;
    control: L.Control;
    zoomToExtentDoneEm: EventEmitter<null>;
    getControl(): L.Control;
    zoomToExtent(): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    private createControl();
    private zoomToExtentClickHandler();
}
