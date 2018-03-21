import '../../stencil.core';
import { GisViewerProps } from '../../models';
export declare class GisViewer {
    compName: string;
    mapContainerEl: HTMLMapContainerElement;
    gisViewerProps: GisViewerProps;
    getVersion(): void;
    zoomToExtent(): void;
    changeDistanceUnits(): void;
    changeCoordinateSystem(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
}
