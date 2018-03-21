import '../../../stencil.core';
import { GisViewerProps, CoordinateSystemType, DistanceUnitType } from '../../../models';
import L from 'leaflet';
export declare class MapContainer {
    compName: string;
    gisViewerProps: GisViewerProps;
    el: HTMLElement;
    gisMap: L.Map;
    distanceUnitType: DistanceUnitType;
    coordinateSystemType: CoordinateSystemType;
    zoomToExtent(): void;
    changeDistanceUnits(): void;
    changeCoordinateSystem(): void;
    constructor();
    componentWillLoad(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
    createMap(): L.Map;
}
