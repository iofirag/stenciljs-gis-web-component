import { Component, Prop, State} from '@stencil/core';
import { TOOL_BAR_TAG } from '../../../../utils/statics';
import _ from 'lodash';
import { ToolbarConfig, DistanceUnitType } from '../../../../models/apiModels';


@Component({
    tag: 'tool-bar',
    styleUrls: [

    ]
})
export class ToolBar {
    compName: string = TOOL_BAR_TAG;
    @Prop() gisMap: L.Map;
    @Prop() config: ToolbarConfig;
    @Prop() distanceUnitType: DistanceUnitType;
    
    @State() element: L.Control;
    
    render() {
        return (
            <div>
                <layer-manager-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.layerManagerConfig} />
                {
                    _.get(this, 'config.toolbarPluginsConfig.drawBarConfig.enable') ? (
                        <draw-bar-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.drawBarConfig} distanceUnitType={this.distanceUnitType} />
                    ) : ('')
                }
                {
                    _.get(this, "config.toolbarPluginsConfig.zoomToExtentConfig.enable") ? (
                        <zoom-to-extent-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.zoomToExtentConfig} />
                    ) : ('')
                }
                {
                    _.get(this, "config.toolbarPluginsConfig.fullScreenConfig.enable") ? (
                        <full-screen-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.fullScreenConfig} />
                    ) : ('')
                }
                {
                    _.get(this, "config.toolbarPluginsConfig.measureConfig.enable") ? (
                        <measure-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.measureConfig} distanceUnitType={this.distanceUnitType} />
                    ) : ('')
                }
                {
                    _.get(this, "config.toolbarPluginsConfig.searchBoxConfig.enable") ? (
                        <search-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.searchBoxConfig} />
                    ) : ('')
                }
            </div>
        );
    }

    componentDidLoad() {
        this.createElement();
    }

    private createElement(): void {
        this.element = this.addToolbarControl();
        this.addFeatureToMap(this.element);
    }

    private addToolbarControl() {
        try {
            let customControl = L.Control.extend({
                options: { position: 'topleft' },
                onAdd: this.toolbarFeaturesDecision
            });
            return new customControl();
        } catch (e) {
            console.error('failed to create custom control: ' + e);
            return null;
        }
    }
}
