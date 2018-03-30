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
    componentWillLoad(): void;
    componentWillUpdate(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
}
