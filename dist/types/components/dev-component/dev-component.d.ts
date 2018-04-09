import '../../stencil.core';
import { GisViewerProps } from '../../models';
export declare class DevComponent {
    gisViewerEl: HTMLGisViewerElement;
    gisViewerState: GisViewerProps;
    componentWillLoad(): void;
    render(): JSX.Element;
    componentDidLoad(): void;
    testZoomToExtend(e: UIEvent): void;
    testChangeDistanceUnits(e: UIEvent): void;
    testChangeCoordinateSystem(e: UIEvent): void;
    testAddShapeInProps(e: UIEvent): void;
    createDevState(): GisViewerProps;
}
