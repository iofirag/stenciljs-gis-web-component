import L from 'leaflet';
// import MiniMap from 'leaflet-minimap';
import { Component, Prop, State } from '@stencil/core';
import { MINI_MAP_PLUGIN_TAG } from '../../../../utils/statics';
import Utils from '../../../../utils/utilities';
import { MiniMapOptions } from '../../../../models/apiModels';
// import { TileLayer } from 'leaflet';
// import { TileLayer, MiniMap } from "leaflet";

@Component({
  tag: "mini-map-plugin",
  styleUrls: [
    "../../../../../node_modules/leaflet-minimap/dist/Control.MiniMap.min.css"
  ]
})
export class MiniMapPlugin {
  compName = MINI_MAP_PLUGIN_TAG;
  @Prop() gisMap: L.Map;

  @State() minimapControl: any;
  @Prop() config: MiniMapOptions;

  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
    if (!this.gisMap) return;
  }
  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    // Minimap
    let osmUrl = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
    var minimapLayer = new L.TileLayer(osmUrl, { minZoom: 0, maxZoom: 13 });
    debugger
    this.minimapControl = L.Control.miniMap(minimapLayer, { toggleDisplay: true });
    // this.minimapControl.addTo(this.gisMap);
    // this.gisMap.addControl(this.minimapControl);
  }

  componentDidUnload() {
    Utils.log_componentDidUnload(this.compName);
    this.gisMap.removeControl(this.minimapControl);
  }
}