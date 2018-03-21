import { Component, State, Prop, Element,/* Listen ,*/ Method } from '@stencil/core';
// import * as leaflet from "leaflet";
import { MAP_CONTAINER_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, MAX_NORTH_EAST, MAX_SOUTH_WEST } from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import { GisViewerProps, CoordinateSystemType, DistanceUnitType } from '../../../models';
import _ from 'lodash';
import L from 'leaflet';


@Component({
  tag: "map-container",
  styleUrls: [
    // "../../../../node_modules/leaflet/dist/leaflet.css"
    // "../../../../node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css",
    'map-container.scss',
  ]
})
export class MapContainer {
  compName: string = MAP_CONTAINER_TAG;
  @Prop() gisViewerProps: GisViewerProps;

  @Element() el: HTMLElement;
  @State() gisMap: L.Map;
  @State() distanceUnitType: DistanceUnitType;
  @State() coordinateSystemType: CoordinateSystemType;

  @Method()
  zoomToExtent() {
    const zoomToExtentEl: HTMLZoomToExtentPluginElement = this.el.querySelector(ZOOM_TO_EXTENT_PLUGIN_TAG);
    zoomToExtentEl.zoomToExtent();
  }
  @Method()
  changeDistanceUnits() {
    const distanceUnitTypes: DistanceUnitType[] = ['km', 'mile', 'nauticalmiles'];
    let index = distanceUnitTypes.indexOf(this.distanceUnitType);
    index++;
    if (index === distanceUnitTypes.length) index = 0;
    this.distanceUnitType = distanceUnitTypes[index];
  }
  @Method()
  changeCoordinateSystem() {
    const coordinateSystemTypes: CoordinateSystemType[] = ['utm','utmref','gps'];
    let index = coordinateSystemTypes.indexOf(this.coordinateSystemType);
    index++;
    if (index === coordinateSystemTypes.length ) index = 0;
    this.coordinateSystemType = coordinateSystemTypes[index];
  }


  constructor() {
    this.distanceUnitType = _.get(this, 'gisViewerProps.mapConfig.distanceUnitType', 'km');
    this.coordinateSystemType = _.get(this, 'gisViewerProps.mapConfig.coordinateSystemType', 'gps');
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
          distanceUnitType={this.distanceUnitType} 
          config={this.gisViewerProps.toolbarConfig} 
          isZoomControl={this.gisViewerProps.mapConfig.isZoomControl}
          mouseCoordinateConfig={this.gisViewerProps.mapPluginsConfig.mouseCoordinateConfig}
        />

        {_.get(this, "gisViewerProps.mapPluginsConfig.scaleConfig.enable") ? (
          <scale-plugin
            gisMap={this.gisMap}
            config={this.gisViewerProps.mapPluginsConfig.scaleConfig}
            distanceUnitType={this.distanceUnitType}
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
            coordinateSystemType={this.coordinateSystemType}
          />
          ) : ('')
        }
      </div>
    );
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