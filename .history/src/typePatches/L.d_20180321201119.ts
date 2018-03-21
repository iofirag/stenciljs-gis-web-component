import { Coordinate } from "../models";

// import L from "leaflet";

// import L from "leaflet";

// import * as L from 'leaflet';

// import { Coordinate } from '../src/api-generated/wrapper/api-src';
// import { ShapeDef_Dev } from '../src/components/gis-viewer/classes/pluginBase';

// import L from 'leaflet';

// import { FeatureGroup, LayerGroup, PathOptions, LatLngLiteral } from "leaflet";
// import { Coordinate, ShapeDefinition } from '../models/apiModels'
// import { Layer,
// FeatureGroup } from "leaflet";

declare module 'leaflet' {

    namespace GeometryUtil {
        function geodesicArea(latlngs: Coordinate[]): number;
    }

    namespace DomUtil {

    }
    namespace Control {
        // class Fullscreen {
        //     constructor(options: any);
        // }
        // class Draw {
        //     constructor(options: any);
        // }
        // interface Scale {
        //     constructor(options: any);
        // }
        class Search {
            constructor(options: any);
        }

        class mouseCoordinate {
            constructor(options: any);
        }
        // interface PolylineMeasure extends Control {
        //     new(options?: PolylineMeasureOptions): any;
        // }
        // interface PolylineMeasureOptions {
        //     position?: string;
        //     unit?: string;
        //     measureControlTitleOn?: string;
        //     measureControlTitleOff?: string;
        //     measureControlLabel?: string;
        //     measureControlClasses?: any[];
        //     backgroundColor?: string;
        //     cursor?: string;
        //     clearMeasurementsOnStop?: boolean;
        //     showMeasurementsClearControl?: boolean;
        //     clearControlTitle?: string;
        //     clearControlLabel?: string;
        //     clearControlClasses?: any[];
        //     showUnitControl?: boolean;
        //     tempLine?: any;
        //     fixedLine?: any;
        //     startCircle?: any;
        //     intermedCircle?: any;
        //     currentCircle?: any;
        //     endCircle?: any;
        // }

        class StyledLayerControl {
            constructor(baseLayers: any[], overlays: any[], map: any, options?: any);
        }

        // class MiniMap {
        //     constructor(layer: any, options: any);
        // }

        class MiniMap {
            constructor(layer: any, options: any);
        }

        class PolylineMeasure {
            constructor(options: any);
        }
        class LinearMeasurement {
            constructor(options: any);
            static extend(arg0: any): any;
        }
        class LinearCore extends Control {
            static extend(arg0: any): any;            
        }
    }

    interface MapOptions {
        // fullscreenControl?: true | { pseudoFullscreen: boolean;
    }

    interface Map {
        toggleFullscreen?: Function;
        // zoomControl: any;
    }

    // namespace Draw {
    //     class Event {
    //         public static CREATED: string;
    //         public static EDITED: string;
    //         public static DELETED: string;
    //     }
    // }

    
    // interface LatLngBounds {
    //     _northEast: Coordinate;
    //     _southWest: Coordinate;
    // }
    interface Circle {
        initialize: any;
    }
    interface Marker {
        // addClass: Function;
        // removeClass: Function;
        _icon?: any;
        __parent?: any;
    }
    interface Label extends Marker { 

    }
    interface Polygon {
        initialize: any;
        _rings?: any[];
    }
    interface Polyline {
        initialize: any
    }

    interface GeoJSON {
        features: GeoJSON[];
        properties: any;
    }

    class HeatLayer extends Layer {
      constructor(latlngs: L.LatLngExpression[], options?: any);
      _latlngs?: any[];
    }

    class MarkerClusterGroup extends FeatureGroup {
        constructor(options: any);
        options: {
            singleMarkerMode?: boolean;
            iconCreateFunction?: Function;
        };
        getAllChildMarkers: Function;
        // getVisibleParent: Function;
        // getChildCount: Function;
        layerName: string;
    }

    interface Layer {
        shapeDef?: ShapeDef_Dev;
        __parent?: any;
        layerName?: string;
        _latlng?: any;
        _latlngs?: any[];
        value?: string;
        _layers?: any;
        // setStyle?: any;
        // toGeoJSON?: Function;
    }

    interface FeatureGroup {
        __parent?: any;
        // _layers: any;
        // _latlng?: any;
        // _latlngs?: any[];
        shapeDef?: ShapeDef_Dev;
        layerName?: string;
    }
}

// export type Coordinate = {
//     lat: number
//     lng: number
// };
export type ShapeDef_Dev = {
    data?: any
    shapeObject?: ShapeObject_Dev;
};
export type ShapeObject_Dev = {
    type?: number
};