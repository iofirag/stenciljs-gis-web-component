import '../../../stencil.core';
import { GisViewerProps, CoordinateSystemType, DistanceUnitType } from '../../../models';
import L from 'leaflet';
export declare class MapContainer {
    compName: string;
    gisViewerProps: GisViewerProps;
    todos: any;
    title: string;
    el: HTMLElement;
    gisMap: L.Map;
    distanceUnitTypeState: DistanceUnitType;
    coordinateSystemTypeState: CoordinateSystemType;
    zoomToExtent(): void;
    changeDistanceUnits(): void;
    changeCoordinateSystem(unit?: CoordinateSystemType): void;
    constructor();
    componentWillLoad(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
    createMap(): L.Map;
}
