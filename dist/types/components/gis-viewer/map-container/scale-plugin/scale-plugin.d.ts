import L from 'leaflet';
import { ScaleConfig, DistanceUnitType } from '../../../../models';
export declare class ScalePlugin {
    compName: string;
    pluginSupportedUnits: string[];
    gisMap: L.Map;
    config: ScaleConfig;
    distanceUnitType: DistanceUnitType;
    control: L.Control;
    watchDistanceUnitType(newValue: DistanceUnitType): void;
    getControl(): L.Control;
    private showScaleUnitsElementByType(globalDistanceUnitType);
    private setScaleUnitsElementVisibility(unit, globalDistanceUnitType);
    private fromGlobalUnitToElementUnit(globalUnit);
    componentWillLoad(): void;
    componentWillUpdate(): void;
    componentDidLoad(): void;
    private initUnitElementsWithClasses();
    componentDidUnload(): void;
}
