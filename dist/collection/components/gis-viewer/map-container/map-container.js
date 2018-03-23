var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// import * as leaflet from "leaflet";
import { MAP_CONTAINER_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, MAX_NORTH_EAST, MAX_SOUTH_WEST } from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import _ from 'lodash';
import L from 'leaflet';
import { autorun, observable } from 'mobx';
import store from './store';
export class MapContainer {
    constructor() {
        this.compName = MAP_CONTAINER_TAG;
        // _.assign(this.store, this.gisViewerProps);
        // console.log(this.store);
        this.distanceUnitTypeState = _.get(this, 'gisViewerProps.mapConfig.distanceUnitType', 'km');
        this.coordinateSystemTypeState = _.get(this, 'gisViewerProps.mapConfig.coordinateSystemType', 'gps');
        autorun(() => {
            // console.log(store)
            console.log(store.unfinishedTodoCount);
            this.todos = store.todos.slice();
        });
    }
    zoomToExtent() {
        const zoomToExtentEl = this.el.querySelector(ZOOM_TO_EXTENT_PLUGIN_TAG);
        zoomToExtentEl.zoomToExtent();
    }
    changeDistanceUnits() {
        const distanceUnitTypes = ['km', 'mile', 'nauticalmiles'];
        let index = distanceUnitTypes.indexOf(this.distanceUnitTypeState);
        index++;
        if (index === distanceUnitTypes.length)
            index = 0;
        this.distanceUnitTypeState = distanceUnitTypes[index];
    }
    changeCoordinateSystem(unit) {
        // User wants specific unit
        if (unit) {
            this.coordinateSystemTypeState = unit;
            return;
        }
        // Change to another coordinate in order
        const coordinateSystemTypes = ['utm', 'utmref', 'gps'];
        let index = coordinateSystemTypes.indexOf(this.coordinateSystemTypeState);
        index++;
        if (index === coordinateSystemTypes.length)
            index = 0;
        this.coordinateSystemTypeState = coordinateSystemTypes[index];
    }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
        this.gisMap = this.createMap();
    }
    // componentWillUpdate() {
    // }
    render() {
        return (h("div", null,
            h("tool-bar", { gisMap: this.gisMap, distanceUnitType: this.distanceUnitTypeState, config: this.gisViewerProps.toolbarConfig, coordinateSystemType: this.coordinateSystemTypeState, isZoomControl: this.gisViewerProps.mapConfig.isZoomControl, mouseCoordinateConfig: this.gisViewerProps.mapPluginsConfig.mouseCoordinateConfig, clusterHeatMode: this.gisViewerProps.mapConfig.mode }),
            _.get(this, "gisViewerProps.mapPluginsConfig.scaleConfig.enable") ? (h("scale-plugin", { gisMap: this.gisMap, config: this.gisViewerProps.mapPluginsConfig.scaleConfig, distanceUnitType: this.distanceUnitTypeState })) : (''),
            _.get(this, "gisViewerProps.mapPluginsConfig.miniMapConfig.enable") ? (h("mini-map-plugin", { gisMap: this.gisMap, config: this.gisViewerProps.mapPluginsConfig.miniMapConfig })) : (''),
            _.get(this, "gisViewerProps.mapPluginsConfig.mouseCoordinateConfig.enable") ? (h("mouse-coordinate-plugin", { gisMap: this.gisMap, config: this.gisViewerProps.mapPluginsConfig.mouseCoordinateConfig, coordinateSystemType: this.coordinateSystemTypeState })) : ('')));
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        // const osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
        // L.tileLayer(osmUrl, {}).addTo(this.gisMap);
    }
    createMap() {
        // Map options
        const extendedOptions = {}; // this.tileLayersComp.setTileLayers(this.context.mapState.baseMaps, tileProps);
        // Zoom control
        extendedOptions.zoomControl = _.get(this, 'gisViewerProps.mapConfig.isZoomControl', true);
        // MAX Bounds
        const northEast = L.latLng(MAX_NORTH_EAST.lat, MAX_NORTH_EAST.lng);
        const southWest = L.latLng(MAX_SOUTH_WEST.lat, MAX_SOUTH_WEST.lng);
        const bounds = new L.LatLngBounds(southWest, northEast);
        Object.assign(extendedOptions, {
            noWrap: true,
            maxBounds: bounds,
            minZoom: 2,
            maxBoundsViscosity: 1.0,
            //   doubleClickZoom: false,
            bounceAtZoomLimits: false,
            zoom: 1,
            center: {
                lat: 0.076304,
                lng: 0.013960
            },
        });
        return new L.Map('map', extendedOptions); // Create Map
    }
    static get is() { return "map-container"; }
    static get properties() { return { "changeCoordinateSystem": { "method": true }, "changeDistanceUnits": { "method": true }, "coordinateSystemTypeState": { "state": true }, "distanceUnitTypeState": { "state": true }, "el": { "elementRef": true }, "gisMap": { "state": true }, "gisViewerProps": { "type": "Any", "attr": "gis-viewer-props" }, "title": { "state": true }, "todos": { "state": true }, "zoomToExtent": { "method": true } }; }
    static get style() { return "/**style-placeholder:map-container:**/"; }
}
__decorate([
    observable
], MapContainer.prototype, "todos", void 0);
__decorate([
    observable
], MapContainer.prototype, "title", void 0);
