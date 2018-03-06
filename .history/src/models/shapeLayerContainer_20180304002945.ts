import { ShapeLayerDefinition } from "./apiModels";
import HeatLayer from 'leaflet'
// import L from 'leaflet';
// info on shape layer for internal use of Gis conponent
// contains ApiModels.ShapeLayerDefinition, which was received from props from external application
export type ShapeLayerContainer = {
    layerDefinition: ShapeLayerDefinition;
    leafletHeatLayer: any; //HeatLayer; //O.A
    leafletClusterLayer: any; //L.MarkerClusterGroup; // O.A */
    isDisplay: boolean;
    // type: LayerType; // TODO
};