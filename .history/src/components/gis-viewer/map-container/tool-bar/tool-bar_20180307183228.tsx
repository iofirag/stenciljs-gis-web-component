import { Component, Prop, State } from '@stencil/core';
import { TOOL_BAR_TAG } from '../../../../utils/statics';


@Component({
    tag: 'tool-bar',
    styleUrls: [

    ]
})
export class ToolBar {
    compName: string = TOOL_BAR_TAG;
    @Prop() gisMap: L.Map;
    @Prop() drawBarConfig: any;
    
    render() {
        return (
            <div>
                {_.get(this, "gisViewerProps.scaleControl.enable") ? (
                    <scale-control-plugin
                        gisMap={this.gisMap}
                        config={this.gisViewerProps.scaleControl}
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
