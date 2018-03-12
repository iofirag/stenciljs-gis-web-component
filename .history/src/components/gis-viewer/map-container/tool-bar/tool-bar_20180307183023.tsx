import { Component, Prop } from '@stencil/core';
import { TOOL_BAR_TAG } from '../../../../utils/statics';


@Component({
    tag: 'tool-bar',
    styleUrls: [

    ]
})
export class ToolBar {
    compName: string = TOOL_BAR_TAG;
    @Prop() gisMap: L.Map;

    @State() toolbarState: any;
    
    render() {
        return (
            <div>
                <draw-bar-plugin gisMap={ this.gisMap } config={} />
                <zoom-to-extent-plugin gisMap={this.gisMap} />
                <full-screen-plugin gisMap={this.gisMap} />
            </div>
        );
    }
}
