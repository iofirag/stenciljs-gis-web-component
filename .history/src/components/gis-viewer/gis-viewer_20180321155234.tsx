import { Component, Prop, Method } from '@stencil/core';
import { GIS_VIEWER_TAG } from '../../utils/statics';
import Utils from '../../utils/utilities';
import { GisViewerProps } from '../../models/apiModels';
// import * as pkgjson from '../../../package.json';
import * as pkgjson from '../../../index2.js'

@Component({
  tag: "gis-viewer",
  styleUrls: [
    "gis-viewer.scss",
    "../../../node_modules/leaflet/dist/leaflet.css"
  ]
})
export class GisViewer {
  compName: string = GIS_VIEWER_TAG;
  mapContainerEl: HTMLMapContainerElement;
  // @Element() el: HTMLElement;
  @Prop() gisViewerProps: GisViewerProps;

  @Method()
  getVersion() {
    // Include version number in compile
    // var pjson = require('../../../package.json');
    // console.log(`GIS v${pkgjson.version}`);
  }
  @Method()
  zoomToExtent() {
    this.mapContainerEl.zoomToExtent();
  }
  @Method()
  changeDistanceUnits() {
    this.mapContainerEl.changeDistanceUnits();
  }
  @Method()
  changeCoordinateSystem() {
    this.mapContainerEl.changeCoordinateSystem();
  }

  render() {
    return <map-container id="map" gisViewerProps={this.gisViewerProps} />;
  }

  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    this.mapContainerEl = document.querySelector("map-container");
    this.getVersion();
  }
}
