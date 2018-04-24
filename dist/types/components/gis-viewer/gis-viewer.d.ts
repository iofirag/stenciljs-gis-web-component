import '../../stencil.core';
import { GisViewerProps, MapBounds, ShapeDefinition } from '../../models';
export declare class GisViewer {
    compName: string;
    mapContainerEl: HTMLMapContainerElement;
    gisViewerProps: GisViewerProps;
    getVersion(): void;
    zoomToExtent(): void;
    changeDistanceUnits(): void;
    changeCoordinateSystem(): void;
    exportMapImage(): Promise<any>;
    getBounds(): MapBounds;
    removeHighlightPOIs(): void;
    getSelectedShapes(): ShapeDefinition[];
    componentWillLoad(): void;
    componentWillUpdate(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
    private verifyIsMapExist();
}
