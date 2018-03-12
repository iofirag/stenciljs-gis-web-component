
// import { GisPluginBase, GisPluginContext } from '../../pluginBase';
// import './ScaleControlComp.css';
// import {FeaturesNames} from "../../statics";
// import { Units } from "../../MapContainer/MapContainer";
// import { ScaleControlOptions } from "../../../../../api-generated/wrapper/api-src/index";

// export default class ScaleControlComp extends GisPluginBase {
// 	element: any;

// 	constructor(private context: GisPluginContext) {
// 		super();
// 		// Do bind first
// 		this.toggleUnits = this.toggleUnits.bind(this);
// 		this.createElement = this.createElement.bind(this);

// 		this.init();
// 	}

// 	init() {
// 		const scaleControlEnable: boolean = _.get(this, 'context.props.scaleControl.enable');

// 		if (scaleControlEnable) {
// 			const { scaleControl } = this.context.props;

// 			// Component options
// 			const objCloned: any = Object.assign({}, scaleControl);
// 			objCloned.metric = true;
// 			objCloned.imperial = true;

// 			const optionsDev: ScaleControlOptions_Dev = objCloned;
// 			this.createElement(optionsDev);
// 		}
// 	}

// 	/**
// 	 * name
// 	 */
// 	public fixHiddenStyleClass() {
// 		const scaleControlDOM: HTMLElement = this.element._container as HTMLElement;
// 		const km:              HTMLElement = scaleControlDOM.childNodes[0] as HTMLElement;
// 		const mi:              HTMLElement = scaleControlDOM.childNodes[1] as HTMLElement;

// 		km.classList.add('scale-unit');
// 		mi.classList.add('scale-unit');

// 		if (this.context.mapUnits === Units.METRIC) {
// 			mi.classList.toggle('hidden');
// 		} else {
// 			km.classList.toggle('hidden');
// 		}
// 	}

// 	public toggleUnits(): void {
// 		const scaleControlDOM: HTMLElement = this.element._container as HTMLElement;
// 		const km:              HTMLElement = scaleControlDOM.childNodes[0] as HTMLElement;
// 		const mi:              HTMLElement = scaleControlDOM.childNodes[1] as HTMLElement;

// 		km.classList.toggle('hidden');
// 		mi.classList.toggle('hidden');
// 	}

// 	private createElement(scaleControlOptionsDev: ScaleControlOptions_Dev): void {
// 		this.element = L.control.scale(<any>scaleControlOptionsDev);
		
// 		this.context.onAddControlToFeatures(FeaturesNames.SCALE_CONTROL_COMP, this);
// 	}
// }





/////////////////////
import L from 'leaflet';
// import * as _ from 'lodash';
import {Component, Prop, State, Watch } from '@stencil/core';
import { SCALE_CONTROL_PLUGIN_TAG } from '../../../../utils/statics';
import Utils from '../../../../utils/utilities';
import { ScaleControlOptions } from '../../../../models/apiModels';
import _ from 'lodash';

@Component({
  tag: "scale-control-plugin",
  styleUrls: ["scale-control-plugin.scss"]
})
export class ScaleControlPlugin {
  compName = SCALE_CONTROL_PLUGIN_TAG;

  @Prop() gisMap: L.Map;
  @Prop() config: ScaleControlOptions;
  @Prop() metric: boolean;

  @State() elementControl: any;

  @Watch('metric')
  validateMetric(newValue: boolean) {
    console.log(`newValue=${newValue} metric=${this.metric}`)
    // Visibility
    this.toggleScaleElementUnits
    this.toggleScaleElement('mi', !this.metric); // Hide mile
    this.toggleScaleElement('km', this.metric);  // Show km
    // if (newValue) {
    //   /* Show Metric */
    //   this.toggleScaleElement('mi', false); // Hide mile
    //   this.toggleScaleElement('km', true);  // Show km
    // } else {
    //   /* Show Mile */
    //   this.toggleScaleElement('mi', true);  // Unhide mile
    //   this.toggleScaleElement('km', false); // Show km
    // }
  }
  public toggleScaleElementUnits() { 
    this.setScaleElementVisibility('mi', !this.metric); // Hide mile
    this.setScaleElementVisibility('km', this.metric);  // Show km
  }
  public setScaleElementVisibility(unit: string, visibility: boolean) {
    let scaleUnitElement: HTMLElement = document.querySelector(`.leaflet-control-scale-line.${unit}`);
    if (visibility) {
      scaleUnitElement.classList.remove('hidden')
    } else {
      scaleUnitElement.classList.add('hidden');
    }
  }
  componentWillLoad() {
    Utils.log_componentWillLoad(this.compName);
  }
  componentWillUpdate() { }

  render() {
    // Create new component
    if (!this.elementControl) {
      const options: L.Control.ScaleOptions = {
        position: this.config.position,
        metric: true,
        imperial: true,
      };
      this.elementControl = L.control.scale(options);
      this.gisMap.addControl(this.elementControl);
    }
    
    // Return nothing
    return null;
  }
  componentDidLoad() {
    Utils.log_componentDidLoad(this.compName);

    let scaleElementList = document.querySelectorAll('.leaflet-control-scale-line');
    _.forEach(scaleElementList, element => {
      if (element.innerHTML.toLowerCase().indexOf('km') > -1) {
        element.classList.add('km');
      }
      if (element.innerHTML.toLowerCase().indexOf('mi') > -1) {
        element.classList.add('mi');
      }
    });

    // Visibility
    this.toggleScaleElement('mi', !this.metric); // Hide mile
    this.toggleScaleElement('km', this.metric);  // Show km

  }


  // // public toggleUnits(): void {
  // // 	const scaleControlDOM: HTMLElement = this.element._container as HTMLElement;
  // // 	const km:              HTMLElement = scaleControlDOM.childNodes[0] as HTMLElement;
  // // 	const mi:              HTMLElement = scaleControlDOM.childNodes[1] as HTMLElement;

  // // 	km.classList.toggle('hidden');
  // // 	mi.classList.toggle('hidden');
  // // }

  // // private createElement(scaleControlOptionsDev: ScaleControlOptions_Dev): void {
  // // 	this.element = L.control.scale(<any>scaleControlOptionsDev);
  // // 	this.context.onAddControlToFeatures(FeaturesNames.SCALE_CONTROL_COMP, this);
  // // }
  componentDidUnload() {
    Utils.log_componentDidUnload(this.compName);
    this.gisMap.removeControl(this.elementControl);
  }
}