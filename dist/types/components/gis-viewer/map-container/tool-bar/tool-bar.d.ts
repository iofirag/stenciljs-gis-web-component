import '../../../../stencil.core';
import { EventEmitter } from '../../../../stencil.core';
import { ToolbarConfig, DistanceUnitType, MouseCoordinateConfig, ClusterHeat, CoordinateSystemType } from '../../../../models';
import L from 'leaflet';
export declare class ToolBar {
    compName: string;
    gisMap: L.Map;
    config: ToolbarConfig;
    distanceUnitType: DistanceUnitType;
    isZoomControl: boolean;
    mouseCoordinateConfig: MouseCoordinateConfig;
    clusterHeatMode: ClusterHeat;
    coordinateSystemType: CoordinateSystemType;
    el: HTMLElement;
    isZoomControlState: any;
    element: L.Control;
    exportDropDownData: any[];
    settingsDropDownData: any[];
    coordsChangeEm: EventEmitter;
    coordsSystemTypeEmHandler(coordsUnit: CoordinateSystemType): void;
    constructor();
    componentWillLoad(): void;
    private changeMouseCoordinate(unit);
    render(): JSX.Element;
    componentDidLoad(): void;
    private createElement();
    private addToolbarControl();
    private toolbarFeaturesDecision();
}
