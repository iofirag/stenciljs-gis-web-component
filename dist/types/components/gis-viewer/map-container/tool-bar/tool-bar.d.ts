import '../../../../stencil.core';
import { ToolbarConfig, DistanceUnitType, MouseCoordinateConfig, ClusterHeat } from '../../../../models';
import L from 'leaflet';
export declare class ToolBar {
    compName: string;
    gisMap: L.Map;
    config: ToolbarConfig;
    distanceUnitType: DistanceUnitType;
    isZoomControl: boolean;
    mouseCoordinateConfig: MouseCoordinateConfig;
    clusterHeatMode: ClusterHeat;
    el: HTMLElement;
    isZoomControlState: any;
    element: L.Control;
    exportDropDownData: any[];
    settingsDropDownData: any[];
    constructor();
    componentWillLoad(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
    private createElement();
    private addToolbarControl();
    private toolbarFeaturesDecision();
}
