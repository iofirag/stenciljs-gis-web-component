import '../../../stencil.core';
import { GisViewerProps, CoordinateSystemType, ShapeDefinition, MapBounds } from '../../../models';
export declare class MapContainer {
    compName: string;
    gisViewerProps: GisViewerProps;
    el: HTMLElement;
    zoomToExtent(): void;
    changeDistanceUnits(): void;
    changeCoordinateSystem(unit?: CoordinateSystemType): void;
    getBounds(): MapBounds;
    getSelectedShapes(): ShapeDefinition[];
    constructor();
    componentWillLoad(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
    /**
       * Map Events:
       * ----------
       * layerremove / layeradd
       * baselayerchange
       * overlayadd / overlayremove
       * boxzoomstart / boxzoomend
       * movestart / moveend - (check those)
       */
    private createEvents();
    private createMap();
    private areaSelection(event);
}
