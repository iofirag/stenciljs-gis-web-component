import { Component, Prop, State } from '@stencil/core';
import { TOOL_BAR_TAG } from '../../../../utils/statics';
import _ from 'lodash';
import { DrawBarOptions, DrawBarConfig, ZoomControlConfig, ZoomToExtentConfig, FullScreenConfig } from '../../../../models/apiModels';


@Component({
    tag: 'tool-bar',
    styleUrls: [

    ]
})
export class ToolBar {
    compName: string = TOOL_BAR_TAG;
    @Prop() gisMap: L.Map;
    @Prop() toolBarConfig: any;
    @Prop() drawBarConfig: any//DrawBarConfig;
    @Prop() zoomToExtentConfig: any//ZoomToExtentConfig;
    @Prop() fullScreenConfig: any//FullScreenConfig;
    @Prop() metric: boolean;
    
    render() {
        return (
            <div>
                {_.get(this, "drawBarConfig.enable") ? (
                    <draw-bar-plugin gisMap={this.gisMap} config={this.drawBarConfig} metric={this.metric} />
                ) : (
                    ""
                    )}
                {_.get(this, "zoomToExtentConfig.enable") ? (
                    <zoom-to-extent-plugin gisMap={this.gisMap} config={this.zoomToExtentConfig} />
                ) : (
                        ""
                    )}
                {_.get(this, "fullScreenConfig.enable") ? (
                    <full-screen-plugin gisMap={this.gisMap} config={this.fullScreenConfig} />
                ) : (
                        ""
                    )}
                
                
            </div>
        );
    }
}
