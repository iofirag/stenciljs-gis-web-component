import L from 'leaflet';
import {Component, Prop, State, Watch } from '@stencil/core';
import { SCALE_CONTROL_PLUGIN_TAG } from '../../../../utils/statics';
import Utils from '../../../../utils/utilities';
import { ScaleControlConfig, DistanceUnitType } from '../../../../models/apiModels';
import _ from 'lodash';

@Component({
  tag: "scale-plugin",
  styleUrls: ["scale-plugin.scss"]
})
export class ScalePlugin {
  compName = SCALE_CONTROL_PLUGIN_TAG;
  pluginSupportedUnits: string[] = ['km', 'mi'];

  @Prop() gisMap: L.Map;
  @Prop() config: ScaleControlConfig;
  @Prop() distanceUnitType: DistanceUnitType;

  @State() elementControl: any;

  @Watch('distanceUnitType')
  watchDistanceUnitType(newValue: DistanceUnitType) {
    // Visibility of elements
    this.showScaleUnitsElementByType(newValue);
  }

  private showScaleUnitsElementByType(globalDistanceUnitType: DistanceUnitType) { 
    this.pluginSupportedUnits.forEach((unit:string) => {
      this.setScaleUnitsElementVisibility(unit, globalDistanceUnitType);
    })
  }
  private setScaleUnitsElementVisibility(unit: string, globalDistanceUnitType) {
    let scaleUnitElement: HTMLElement = this.gisMap.getContainer().querySelector(`.leaflet-control-scale-line.${unit}`);
    let visibilityForThisUnit: boolean = unit === this.fromGlobalUnitToElementUnit(globalDistanceUnitType);
    if (visibilityForThisUnit) {
      scaleUnitElement.classList.remove('hidden')
    } else {
      scaleUnitElement.classList.add('hidden');
    }
  }
  private fromGlobalUnitToElementUnit(globalUnit: DistanceUnitType): string {
    switch (globalUnit.toLowerCase()) {
      case 'km':
        return 'km';
      case 'mile':
        return 'mi';
      case 'nauticalmiles':
        return ''
    }
  }
  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
  }
  componentWillUpdate() { }

  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);
    // Create new component
    const options: L.Control.ScaleOptions = {
      position: this.config.scaleControlOptions.position,
      metric: true,
      imperial: true,
    };
    this.elementControl = L.control.scale(options);
    this.gisMap.addControl(this.elementControl);
    
    this.initUnitElementsWithClasses();
    this.showScaleUnitsElementByType(this.distanceUnitType);
  }

  private initUnitElementsWithClasses() {
    // Initialization for element's class
    let scaleElementList = this.gisMap.getContainer().querySelectorAll('.leaflet-control-scale-line');
    _.forEach(scaleElementList, element => {
      const elmInnerHtml = element.innerHTML.toLowerCase();
      this.pluginSupportedUnits.forEach(unit => {
        if (elmInnerHtml.indexOf(unit) > -1) {
          element.classList.add(unit);
        }
      })
    });
  }
  componentDidUnload() {
    Utils.log_componentDidUnload(this.compName);
    this.gisMap.removeControl(this.elementControl);
  }
}