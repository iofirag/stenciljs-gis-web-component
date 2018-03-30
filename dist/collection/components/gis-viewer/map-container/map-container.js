// import * as leaflet from "leaflet";
import { MAP_CONTAINER_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, MAX_NORTH_EAST, MAX_SOUTH_WEST } from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import _ from 'lodash';
import L from 'leaflet';
import store from '../../store/store';
export class MapContainer {
    constructor() {
        this.compName = MAP_CONTAINER_TAG;
    }
    zoomToExtent() {
        const zoomToExtentEl = this.el.querySelector(ZOOM_TO_EXTENT_PLUGIN_TAG);
        zoomToExtentEl.zoomToExtent();
    }
    changeDistanceUnits() {
        const distanceUnitTypes = ['km', 'mile', 'nauticalmiles'];
        let index = distanceUnitTypes.indexOf(store.state.mapConfig.distanceUnitType);
        index++;
        if (index === distanceUnitTypes.length)
            index = 0;
        store.state.mapConfig.distanceUnitType = distanceUnitTypes[index];
    }
    changeCoordinateSystem(unit) {
        // User wants specific unit
        if (unit) {
            store.state.mapConfig.coordinateSystemType = unit;
            return;
        }
        // Change to another coordinate in order
        const coordinateSystemTypes = ['utm', 'utmref', 'gps'];
        let index = coordinateSystemTypes.indexOf(store.state.mapConfig.coordinateSystemType);
        index++;
        if (index === coordinateSystemTypes.length)
            index = 0;
        store.state.mapConfig.coordinateSystemType = coordinateSystemTypes[index];
    }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
        this.gisMap = this.createMap();
    }
    render() {
        return (h("div", null,
            h("tool-bar", { gisMap: this.gisMap, config: store.state.toolbarConfig, mouseCoordinateConfig: store.state.mapPluginsConfig.mouseCoordinateConfig }),
            _.get(this, "gisViewerProps.mapPluginsConfig.scaleConfig.enable") ? (h("scale-plugin", { gisMap: this.gisMap, config: store.state.mapPluginsConfig.scaleConfig })) : (''),
            _.get(this, "gisViewerProps.mapPluginsConfig.miniMapConfig.enable") ? (h("mini-map-plugin", { gisMap: this.gisMap, config: store.state.mapPluginsConfig.miniMapConfig })) : (''),
            _.get(this, "gisViewerProps.mapPluginsConfig.mouseCoordinateConfig.enable") ? (h("mouse-coordinate-plugin", { gisMap: this.gisMap, config: store.state.mapPluginsConfig.mouseCoordinateConfig })) : ('')));
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
    static get properties() { return { "changeCoordinateSystem": { "method": true }, "changeDistanceUnits": { "method": true }, "el": { "elementRef": true }, "gisMap": { "state": true }, "gisViewerProps": { "type": "Any", "attr": "gis-viewer-props" }, "zoomToExtent": { "method": true } }; }
    static get style() { return "/**style-placeholder:map-container:**/"; }
}
