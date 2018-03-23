import { Component, State, Prop, Element, Method } from '@stencil/core';
// import * as leaflet from "leaflet";
import { MAP_CONTAINER_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, MAX_NORTH_EAST, MAX_SOUTH_WEST } from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import { GisViewerProps, CoordinateSystemType, DistanceUnitType } from '../../../models';
import _ from 'lodash';
import L from 'leaflet';
import { autorun, observable } from 'mobx';
import store from './store'

@Component({
  tag: "map-container",
  styleUrls: [
    // "../../../../node_modules/leaflet/dist/leaflet.css"
    'map-container.scss',
  ]
})
export class MapContainer {
  compName: string = MAP_CONTAINER_TAG;
  @Prop() gisViewerProps: GisViewerProps;

  @observable @State() todos: any
  @observable @State() title: string
  
  @Element() el: HTMLElement;
  @State() gisMap: L.Map;
  @State() distanceUnitTypeState: DistanceUnitType;
  @State() coordinateSystemTypeState: CoordinateSystemType;

  @Method()
  zoomToExtent() {
    const zoomToExtentEl: HTMLZoomToExtentPluginElement = this.el.querySelector(ZOOM_TO_EXTENT_PLUGIN_TAG);
    zoomToExtentEl.zoomToExtent();
  }
  @Method()
  changeDistanceUnits() {
    const distanceUnitTypes: DistanceUnitType[] = ['km', 'mile', 'nauticalmiles'];
    let index = distanceUnitTypes.indexOf(this.distanceUnitTypeState);
    index++;
    if (index === distanceUnitTypes.length) index = 0;
    this.distanceUnitTypeState = distanceUnitTypes[index];
  }
  @Method()
  changeCoordinateSystem(unit?: CoordinateSystemType) {
    // User wants specific unit
    if (unit) {
      this.coordinateSystemTypeState = unit;
      return;
    }
    // Change to another coordinate in order
    const coordinateSystemTypes: CoordinateSystemType[] = ['utm','utmref','gps'];
    let index = coordinateSystemTypes.indexOf(this.coordinateSystemTypeState);
    index++;
    if (index === coordinateSystemTypes.length ) index = 0;
    this.coordinateSystemTypeState = coordinateSystemTypes[index];
  }

  


  constructor() {
    // _.assign(this.store, this.gisViewerProps);
    // console.log(this.store);
    this.distanceUnitTypeState = _.get(this, 'gisViewerProps.mapConfig.distanceUnitType', 'km');
    this.coordinateSystemTypeState = _.get(this, 'gisViewerProps.mapConfig.coordinateSystemType', 'gps');

    autorun(() => {
      // console.log(store)
      console.log(store.unfinishedTodoCount)
      this.todos = store.todos.slice()
    })
  }
  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
    this.gisMap = this.createMap();
  }

  // componentWillUpdate() {
  // }

  render() {
    return (
      <div>
        <tool-bar gisMap={this.gisMap} 
          distanceUnitType={this.distanceUnitTypeState} 
          config={this.gisViewerProps.toolbarConfig} 
          coordinateSystemType={this.coordinateSystemTypeState}
          isZoomControl={this.gisViewerProps.mapConfig.isZoomControl}
          mouseCoordinateConfig={this.gisViewerProps.mapPluginsConfig.mouseCoordinateConfig}
          clusterHeatMode={this.gisViewerProps.mapConfig.mode}
        />

        {_.get(this, "gisViewerProps.mapPluginsConfig.scaleConfig.enable") ? (
          <scale-plugin
            gisMap={this.gisMap}
            config={this.gisViewerProps.mapPluginsConfig.scaleConfig}
            distanceUnitType={this.distanceUnitTypeState}
          />
          ) : ('')
        }
        
        {_.get(this, "gisViewerProps.mapPluginsConfig.miniMapConfig.enable") ? (
          <mini-map-plugin
            gisMap={this.gisMap}
            config={this.gisViewerProps.mapPluginsConfig.miniMapConfig}
          />
          ) : ('')
        }

        {_.get(this, "gisViewerProps.mapPluginsConfig.mouseCoordinateConfig.enable") ? (
          <mouse-coordinate-plugin
            gisMap={this.gisMap}
            config={this.gisViewerProps.mapPluginsConfig.mouseCoordinateConfig}
            coordinateSystemType={this.coordinateSystemTypeState}
          />
          ) : ('')
        }
      </div>
    )
  }
  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    // const osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
    // L.tileLayer(osmUrl, {}).addTo(this.gisMap);
  }

  public createMap(): L.Map {
    // Map options
    const extendedOptions: any = {}; // this.tileLayersComp.setTileLayers(this.context.mapState.baseMaps, tileProps);

    // Zoom control
    extendedOptions.zoomControl = _.get(this, 'gisViewerProps.mapConfig.isZoomControl', true);

    // MAX Bounds
    const northEast = L.latLng(MAX_NORTH_EAST.lat, MAX_NORTH_EAST.lng);
    const southWest = L.latLng(MAX_SOUTH_WEST.lat, MAX_SOUTH_WEST.lng);
    const bounds = new L.LatLngBounds(southWest, northEast);
    
    Object.assign(extendedOptions, {
      noWrap: true,
      maxBounds: bounds,
      minZoom: 2, // _.max([extendedOptions.minZoom, 2]),
      maxBoundsViscosity: 1.0,
      //   doubleClickZoom: false,
      bounceAtZoomLimits: false,
      zoom: 1,
      center: {
        lat: 0.076304,
        lng: 0.013960
      },
      // preferCanvas: true,
      // renderer: L.canvas(),
    });
    return new L.Map('map', extendedOptions);  // Create Map
  }
}