import '../../stencil.core';
import { GisViewerProps } from '../../models';
export declare class DevComponent {
    gisViewerEl: HTMLGisViewerElement;
    gisViewerState: GisViewerProps;
    componentWillLoad(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
    testGetAllSelectedShape(): void;
    testRemoveHighlightPOIs(): void;
    testExportBounds(): void;
    testZoomToExtend(e: UIEvent): void;
    testChangeDistanceUnits(e: UIEvent): void;
    testExportImage(): void;
    testChangeCoordinateSystem(e: UIEvent): void;
    testAddShapeInProps(e: UIEvent): void;
    createDevState(): GisViewerProps;
}
