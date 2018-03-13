import L from 'leaflet';
import {Component, Prop, State, Watch } from '@stencil/core';
import { SCALE_CONTROL_PLUGIN_TAG } from '../../../../utils/statics';
import Utils from '../../../../utils/utilities';
import { ScaleControlConfig, DistanceUnitType } from '../../../../models/apiModels';
import _ from 'lodash';

@Component({
  tag: "scale-control-plugin",
  styleUrls: ["scale-control-plugin.scss"]
})
export class ScaleControlPlugin {
  compName = SCALE_CONTROL_PLUGIN_TAG;
  pluginSupportedUnits: string[] = ['km', 'mi'];

  @Prop() gisMap: L.Map;
  @Prop() config: ScaleControlConfig;
  @Prop() distanceUnitType: DistanceUnitType;

  @State() elementControl: any;

  @Watch('distanceUnitType')
  watchDistanceUnitType(newValue: DistanceUnitType) {
    // Visibility
    this.showScaleUnitsElementByType(newValue);
  }

  private showScaleUnitsElementByType(globalDistanceUnitType: DistanceUnitType) { 
    this.pluginSupportedUnits.forEach((unit:string) => {
      this.setScaleUnitsElementVisibility(unit, globalDistanceUnitType); // Hide mile
    })

    // this.setScaleUnitsElementVisibility('mi', 'mi' === this.fromGlobalUnitToElementUnit(globalDistanceUnitType)); // Hide mile
    // this.setScaleUnitsElementVisibility('km', 'km' === this.fromGlobalUnitToElementUnit(globalDistanceUnitType));  // Show km
  }
  private setScaleUnitsElementVisibility(unit: string, globalDistanceUnitType) {
    // let elementTextUnitShouldBe: string = this.fromGlobalUnitToElementUnit(this.distanceUnitType);
    // if (elmInnerHtml.indexOf(elementTextUnitShouldBe) > -1) {
    //   element.classList.add(elementTextUnitShouldBe);
    // }
    let scaleUnitElement: HTMLElement = this.gisMap.getContainer().querySelector(`.leaflet-control-scale-line.${unit}`);
    if (unit === this.fromGlobalUnitToElementUnit()) {
      scaleUnitElement.classList.remove('hidden')
    } else {
      scaleUnitElement.classList.add('hidden');
    }
  }
  private fromGlobalUnitToElementUnit(globalUnit: DistanceUnitType): string {
    // 'metres', 'landmiles', 'nauticalmiles'
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