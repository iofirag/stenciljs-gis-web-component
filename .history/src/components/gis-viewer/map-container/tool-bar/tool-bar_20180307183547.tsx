import { Component, Prop, State } from '@stencil/core';
import { TOOL_BAR_TAG } from '../../../../utils/statics';
import _ from 'lodash';
import { DrawBarOptions } from '../../../../models/apiModels';


@Component({
    tag: 'tool-bar',
    styleUrls: [

    ]
})
export class ToolBar {
    compName: string = TOOL_BAR_TAG;
    @Prop() gisMap: L.Map;
    @Prop() drawBarConfig: DrawBarOptions;
    @
    
    render() {
        return (
            <div>
                {_.get(this, "drawBarConfig.enable") ? (
                    <scale-control-plugin
                        gisMap={this.gisMap}
                        config={this.drawBarConfig}
                        metric={this.metric}
                    />
                ) : (
                        ""
                    )}
                <draw-bar-plugin gisMap={this.gisMap} config={this.drawBarConfig} />
                <zoom-to-extent-plugin gisMap={this.gisMap} />
                <full-screen-plugin gisMap={this.gisMap} />
            </div>
        );
    }
}
