import { Component, State, Prop, Listen, Method } from '@stencil/core';
// import * as leaflet from "leaflet";
import { MAP_CONTAINER_TAG } from '../../../utils/statics';
import Utils from '../../../utils/utilities';
import { GisViewerProps } from '../../../models/apiModels';
import _ from 'lodash';
import L from 'leaflet';
import * as MiniMap from "leaflet-minimap";


@Component({
  tag: "map-container",
  styleUrls: [
    // "../../../../node_modules/leaflet-fullscreen/dist/leaflet.fullscreen.css",
    // 'map-container.scss',
  ]
})
export class MapContainer {
  compName: string = MAP_CONTAINER_TAG;
  @Prop() gisViewerProps: GisViewerProps;
  @State() gisMap: L.Map;
  @State() metric: boolean;

  @Listen("distanceUnitsEm")
  changeUnitsHandler(event: CustomEvent) {
    console.log("Received the custom mile event: ", event.detail);
    this.changeUnits();
  }
  @Method()
  changeUnits() {
    this.metric = !this.metric;
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
    this.metric = this.gisViewerProps.mapSettings.metric;
    debugger
    // console.log(MiniMap)
  }
  render() {
    return (
      <div>
        <tool-bar gisMap={this.gisMap} />
        {_.get(this, "gisViewerProps.miniMap.enable") ? (
          <mini-map-plugin
            gisMap={this.gisMap}
            config={this.gisViewerProps.miniMap}
          />
        ) : (
          ""
        )}
        {_.get(this, "gisViewerProps.scaleControl.enable") ? (
          <scale-control-plugin
            gisMap={this.gisMap}
            metric={this.metric}
            // config={this.gisViewerProps.scaleControl}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    const osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
    L.tileLayer(osmUrl, {}).addTo(this.gisMap);

    L.marker([32, 35])
      .addTo(this.gisMap)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();
  }
}