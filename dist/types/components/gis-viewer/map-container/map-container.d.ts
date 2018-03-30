import '../../../stencil.core';
import { GisViewerProps, CoordinateSystemType } from '../../../models';
import L from 'leaflet';
export declare class MapContainer {
    compName: string;
    gisViewerProps: GisViewerProps;
    el: HTMLElement;
    gisMap: L.Map;
    zoomToExtent(): void;
    changeDistanceUnits(): void;
    changeCoordinateSystem(unit?: CoordinateSystemType): void;
    constructor();
    componentWillLoad(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
    createMap(): L.Map;
}
