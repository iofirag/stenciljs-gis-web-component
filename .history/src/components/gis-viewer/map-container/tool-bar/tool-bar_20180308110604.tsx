import { Component, Prop, /* State */ } from '@stencil/core';
import { TOOL_BAR_TAG } from '../../../../utils/statics';
import _ from 'lodash';
// import { ZoomToExtentConfig, DrawBarConfig, FullScreenConfig } from '../../../../models/apiModels';


@Component({
    tag: 'tool-bar',
    styleUrls: [

    ]
})
export class ToolBar {
    compName: string = TOOL_BAR_TAG;
    @Prop() gisMap: L.Map;
    @Prop() config: any;
    // @Prop() drawBarConfig: DrawBarConfig;
    // @Prop() zoomToExtentConfig: ZoomToExtentConfig;
    // @Prop() fullScreenConfig: FullScreenConfig;
    @Prop() metric: boolean;
    
    render() {
        return (
            <div>
                {_.get(this, "drawBarConfig.enable") ? (
                    <draw-bar-plugin gisMap={this.gisMap} config={this.config.drawBarConfig} metric={this.metric} />
                ) : (
                    ""
                    )}
                {_.get(this, "config.zoomToExtentConfig.enable") ? (
                    <zoom-to-extent-plugin gisMap={this.gisMap} config={this.config.zoomToExtentConfig} />
                ) : (
                        ""
                    )}
                {_.get(this, "config.fullScreenConfig.enable") ? (
                    <full-screen-plugin gisMap={this.gisMap} config={this.config.fullScreenConfig} />
                ) : (
                        ""
                    )}
                
                
            </div>
        );
    }
}
