import { Component, Prop, Method } from '@stencil/core';
import { GIS_VIEWER_TAG } from '../../utils/statics';
import Utils from '../../utils/utilities';
import { GisViewerProps } from '../../models';
import store from '../store/store';
// import * as pkgjson from '../../../package.json';
// import {version} from '../../../../../stencil.config'

@Component({
  tag: "gis-viewer",
  styleUrls: [
    "../../../node_modules/leaflet/dist/leaflet.css",
    "gis-viewer.scss",
  ]
})
export class GisViewer {
  compName: string = GIS_VIEWER_TAG;
  mapContainerEl: HTMLMapContainerElement;
  // @Element() el: HTMLElement;
  @Prop() gisViewerProps: GisViewerProps;

  // @Watch('gisViewerProps')
  // aaa () {
  //   debugger
  // }


  @Method()
  getVersion() {
    // Include version number in compile
    // var pjson = require('../../../package.json');
    // console.log(`GIS v${pkgjson.version}`);
    // console.log(version)
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


  componentWillLoad() {
    store.initState(this.gisViewerProps);
  }
  componentWillUpdate() {
    store.updateState(this.gisViewerProps)
  }
  render() {
    return <map-container id='map' gisViewerProps={store.state} />;
  }

  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    this.mapContainerEl = document.querySelector("map-container");
    this.getVersion();
  }
}
