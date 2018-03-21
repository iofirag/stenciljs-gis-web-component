import { Component, State, Prop, /* Listen ,*/ Method } from '@stencil/core';
// import * as leaflet from "leaflet";
import { MAP_CONTAINER_TAG } from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import { GisViewerProps, CoordinateSystemType, DistanceUnitType } from '../../../models/apiModels';
import _ from 'lodash';
import L from 'leaflet';
// import L from "leaflet-minimap";


@Component({
  tag: "map-container",
  styleUrls: [
    // "../../../../node_modules/leaflet/dist/leaflet.css"
    // "../../../../node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css",
    // 'map-container.scss',
  ]
})
export class MapContainer {
  compName: string = MAP_CONTAINER_TAG;
  @Prop() gisViewerProps: GisViewerProps;

  @State() gisMap: L.Map;
  @State() distanceUnitType: DistanceUnitType;
  @State() coordinateSystemType: CoordinateSystemType;
  // @State() toolbarConfig: ToolbarConfig;

  // @Listen("distanceUnitsEm")
  // changeUnitsHandler(event: CustomEvent) {
  //   console.log("Received the custom mile event: ", event.detail);
  //   this.changeUnits();
  // }

  @Method()
  zoomToExtent() {
    const distanceUnitTypes: DistanceUnitType[] = ['km', 'mile', 'nauticalmiles'];
    let index = distanceUnitTypes.indexOf(this.distanceUnitType);
    index++;
    if (index === distanceUnitTypes.length) index = 0;
    this.distanceUnitType = distanceUnitTypes[index];
  }
  @Method()
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
  constructor() {}

  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
    const mapOptions: L.MapOptions = {
      // fullscreenControl: true,
      zoom: 12,
      center: { lat: 32, lng: 35 }
    };
    this.gisMap = new L.Map("map", mapOptions);
    this.distanceUnitType = _.get(this, 'gisViewerProps.mapConfig.distanceUnitType', 'km');
    this.coordinateSystemType = _.get(this, 'gisViewerProps.mapConfig.coordinateSystemType', 'gps');
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
        />

        {
          _.get(this, "gisViewerProps.mapPluginsConfig.scaleControlConfig.enable") ? (
          <scale-plugin
            gisMap={this.gisMap}
            config={this.gisViewerProps.mapPluginsConfig.scaleControlConfig}
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
}