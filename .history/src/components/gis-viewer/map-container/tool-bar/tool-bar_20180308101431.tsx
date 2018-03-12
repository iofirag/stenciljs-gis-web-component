import { Component, Prop, State } from '@stencil/core';
import { TOOL_BAR_TAG } from '../../../../utils/statics';
import _ from 'lodash';
import { DrawBarOptions, DrawBarConfig, ZoomControlConfig } from '../../../../models/apiModels';


@Component({
    tag: 'tool-bar',
    styleUrls: [

    ]
})
export class ToolBar {
    compName: string = TOOL_BAR_TAG;
    @Prop() gisMap: L.Map;
    @Prop() toolBarConfig: any;
    @Prop() drawBarConfig: DrawBarConfig;
    @Prop() zoomToExtent: ZoomControlConfig;
    @Prop
    @Prop() metric: boolean;
    
    render() {
        return (
            <div>
                {_.get(this, "drawBarConfig.enable") ? (
                    <draw-bar-plugin gisMap={this.gisMap} config={this.drawBarConfig} metric={this.metric} />
                ) : (
                    ""
                )}
                {_.get(this, "drawBarConfig.enable") ? (
                    <draw-bar-plugin gisMap={this.gisMap} config={this.drawBarConfig} metric={this.metric} />
                ) : (
                        ""
                    )}
                {_.get(this, "drawBarConfig.enable") ? (
                    <draw-bar-plugin gisMap={this.gisMap} config={this.drawBarConfig} metric={this.metric} />
                ) : (
                        ""
                    )}
                <zoom-to-extent-plugin gisMap={this.gisMap} />
                <full-screen-plugin gisMap={this.gisMap} />
            </div>
        );
    }
}
