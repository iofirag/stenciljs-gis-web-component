import L from 'leaflet';
import { ScaleConfig } from '../../../../models';
export declare class ScalePlugin {
    compName: string;
    pluginSupportedUnits: string[];
    gisMap: L.Map;
    config: ScaleConfig;
    control: L.Control;
    getControl(): L.Control;
    constructor();
    private showScaleUnitsElementByType(globalDistanceUnitType);
    private setScaleUnitsElementVisibility(unit, globalDistanceUnitType);
    private fromGlobalUnitToElementUnit(globalUnit);
    componentWillLoad(): void;
    componentWillUpdate(): void;
    componentDidLoad(): void;
    private initUnitElementsWithClasses();
    componentDidUnload(): void;
}
