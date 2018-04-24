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
        class Search extends Control {
            constructor(options: any);
        }

        class mouseCoordinate extends Control {
            constructor(options: any);
        }
        class CustomDropDownPlugin extends Control {
            constructor(options: any);
            // customUpdate();
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

        class StyledLayerControl extends Control {
            constructor(baseLayers: any[], overlays: any[], map: any, options?: any);
            addBaseLayer(layer: any, name: any, group: any);
            addOverlay(layer: any, name: any, group: any, className?: string)
            deleteLayer(layer: any)
            removeLayer(layer: any)
            removeGroup(group_Name: string, del: any)
            removeAllGroups(del: any)
            selectLayer(layer: any)
            unSelectLayer(layer: any)
            changeGroup(group_Name: string, select: any)
        }

        // class MiniMap {
        //     constructor(layer: any, options: any);
        // }

        class MiniMap extends Control {
            constructor(layer: any, options: any);
        }

        class PolylineMeasure extends Control {
            constructor(options: any);
        }
        class LinearMeasurement extends Control {
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


    interface LatLngBounds {
        _northEast: Coordinate;
        _southWest: Coordinate;
    }
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
        groupId?: string;
        id?: string;
        // shapeDef?: ShapeDef_Dev;
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
        groupId?: string;
        id?: string;
        __parent?: any;
        // _layers: any;
        // _latlng?: any;
        // _latlngs?: any[];
        // shapeDef?: ShapeDef_Dev;
        layerName?: string;
    }
}

// export type Coordinate = {
//     lat: number
//     lng: number
// };
// export type ShapeDef_Dev = {
//     data?: any
//     shapeObject?: ShapeObject_Dev;
// };
// export type ShapeObject_Dev = {
//     type?: number
// };
