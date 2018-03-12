import { Component, Prop, /* State */ } from '@stencil/core';
import { TOOL_BAR_TAG } from '../../../../utils/statics';
import _ from 'lodash';
import { ToolbarConfig } from '../../../../models/apiModels';
// import { ZoomToExtentConfig, DrawBarConfig, FullScreenConfig } from '../../../../models/apiModels';


@Component({
    tag: 'tool-bar',
    styleUrls: [

    ]
})
export class ToolBar {
    compName: string = TOOL_BAR_TAG;
    @Prop() gisMap: L.Map;
    @Prop() config: ToolbarConfig;
    @Prop() metric: boolean;
    
    render() {
        return (
            <div>
                {_.get(this, "config.toolbarPluginsConfig.drawBarConfig.enable") ? (
                    <draw-bar-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.drawBarConfig} metric={this.metric} />
                ) : (
                    ""
                )}
                {_.get(this, "config.toolbarPluginsConfig.zoomToExtentConfig.enable") ? (
                    <zoom-to-extent-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.zoomToExtentConfig} />
                ) : (
                    ""
                )}
                {_.get(this, "config.toolbarPluginsConfig.fullScreenConfig.enable") ? (
                    <full-screen-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.fullScreenConfig} />
                ) : (
                    ""
                )}
            </div>
        );
    }
}
