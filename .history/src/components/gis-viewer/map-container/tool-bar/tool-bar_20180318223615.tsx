import { Component, Prop, State} from '@stencil/core';
import { TOOL_BAR_TAG, DRAW_BAR_PLUGIN_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG } from '../../../../utils/statics';
import _ from 'lodash';
import { ToolbarConfig, DistanceUnitType } from '../../../../models/apiModels';
import L from 'leaflet';
import Utils from '../../../../utils/utilities';


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
        // this.addFeatureToMap(this.element);
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
    private toolbarFeaturesDecision() {

        // // create toolbar wrapper controller groups
        const controllerSettingsGroup: HTMLElement = L.DomUtil.create('div', 'custom-toolbar-group');
        const controllerDrawGroup: HTMLElement = L.DomUtil.create('div', 'custom-toolbar-group');
        const controllerMapGroup: HTMLElement = L.DomUtil.create('div', 'custom-toolbar-group');
        const controllerSearchGroup: HTMLElement = L.DomUtil.create('div', 'custom-toolbar-group');
        const controllerActionsGroup: HTMLElement = L.DomUtil.create('div', 'custom-toolbar-group');
        const controllerImportExportGroup: HTMLElement = L.DomUtil.create('div', 'custom-toolbar-group');

        // Draw
        let drawBar: HTMLElement;
        // let drawBar: any = {};
        let editDrawBar: HTMLElement;
        // const settingsControllerName = FeaturesNames.CUSTOM_DROP_DOWN_COMP + '_' + CustomControlName.SETTINGS;
        
        // me.features
        let drawBarPluginEl: HTMLDrawBarPluginElement = document.querySelector(`${DRAW_BAR_PLUGIN_TAG}`);
        if (drawBarPluginEl) {
        //     const drawBarLeafletElement: any = this.features[FeaturesNames.DRAWBAR_COMP].element;
        //     this.addFeatureToMap(drawBarLeafletElement);
            drawBar = drawBarPluginEl.drawControl.getContainer().childNodes[0] as HTMLElement;
        //     // setting id for future styling purposes
            drawBar.id = "draw-shapes-section";
            editDrawBar = drawBarPluginEl.drawControl.getContainer().childNodes[1] as HTMLElement;
        }

        // if (this.context.props.zoomControl && this.context.props.zoomControl.enable) {
            const zoomController: HTMLElement = document.querySelector('.leaflet-control-zoom') as HTMLElement;
            controllerMapGroup.appendChild(zoomController);
        // }

        let zoomToExtentPluginEl: HTMLZoomToExtentPluginElement = document.querySelector(`${ZOOM_TO_EXTENT_PLUGIN_TAG}`);
        if (zoomToExtentPluginEl) {
        // if (this.features[FeaturesNames.ZOOM_TO_EXTEND_COMP]) {
            // const zoomToExtendLeafletElement: any = this.features[FeaturesNames.ZOOM_TO_EXTEND_COMP].element;
            // this.addFeatureToMap(zoomToExtendLeafletElement);
            // Stop double click on plugin
            Utils.stopDoubleClickOnPlugin(zoomToExtentPluginEl.zoomControl.getContainer());
        }

        // if (this.features[FeaturesNames.DROP_DOWN_COMP]) {
        //     const dropDownLeafletElement: any = this.features[FeaturesNames.DROP_DOWN_COMP].element;
        //     this.addFeatureToMap(dropDownLeafletElement);
        //     // Stop double click on plugin
        //     Utils.stopDoubleClickOnPlugin(dropDownLeafletElement._container);
        // }

        // if (this.features[settingsControllerName]) {
        //     const settingsElement: any = this.features[settingsControllerName].element;
        //     this.addFeatureToMap(settingsElement);
        //     // Stop double click on plugin
        //     Utils.stopDoubleClickOnPlugin(settingsElement._container);
        // }

        let searchBoxPluginEl: HTMLSearchPluginElementElement = document.querySelector(`${ZOOM_TO_EXTENT_PLUGIN_TAG}`);
        if (this.features[FeaturesNames.SEARCH_BOX_COMP]) {
            const searchLeafletElement: any = this.features[FeaturesNames.SEARCH_BOX_COMP].element;
            this.addFeatureToMap(searchLeafletElement);
            this.features[FeaturesNames.SEARCH_BOX_COMP].fixCss();
            // Stop double click on plugin
            Utils.stopDoubleClickOnPlugin(searchLeafletElement._container);
        }

        // Measure
        if (this.features[FeaturesNames.MEASURE_COMP]) {
            const measureLeafletElement: any = this.features[FeaturesNames.MEASURE_COMP].element;
            this.addFeatureToMap(measureLeafletElement);
            const measure: HTMLElement = measureLeafletElement._container;
            measure.classList.add('polyline-measure');
        }

        const container: HTMLElement = L.DomUtil.create('div', 'custom-toolbar leaflet-draw-toolbar leaflet-bar');

        const controllerGroupMap = {
            [FeaturesNames.LAYERS_CONTROLLER_COMP]: [controllerMapGroup],
            [FeaturesNames.DRAWBAR_COMP]: [controllerDrawGroup, controllerActionsGroup],
            [FeaturesNames.MEASURE_COMP]: [controllerDrawGroup],
            [FeaturesNames.SEARCH_BOX_COMP]: [controllerSearchGroup],
            [FeaturesNames.ZOOM_TO_EXTEND_COMP]: [controllerMapGroup],
            [FeaturesNames.DROP_DOWN_COMP]: [controllerImportExportGroup],
            [FeaturesNames.CUSTOM_DROP_DOWN_COMP + '_' + CustomControlName.SETTINGS]: [controllerSettingsGroup],
        };


        // Feature iterate
        this.toolbarEnabledPlugins.forEach((featureKey: string) => {
            // draw or zoomToExtend
            if (this.features[featureKey]) {
                let htmlElement: HTMLElement = null;
                if (featureKey === FeaturesNames.LAYERS_CONTROLLER_COMP) {
                    htmlElement = this.features[featureKey].htmlBtElement;
                } else {
                    htmlElement = this.features[featureKey].element._container;
                }

                const controlList = controllerGroupMap[featureKey];
                controlList.forEach(cg => {
                    if (featureKey === FeaturesNames.DRAWBAR_COMP) {
                        // Special case for drawBar_comp
                        const childs = htmlElement.childNodes;
                        if (childs && childs.length) {
                            cg.appendChild(childs[0]);
                        }
                    } else {
                        cg.appendChild(htmlElement);
                    }
                });
            }
        });

        const controllerGroups = [
            controllerSettingsGroup,
            controllerImportExportGroup,
            controllerActionsGroup,
            controllerDrawGroup,
            controllerMapGroup,
            controllerSearchGroup,
        ];

        controllerGroups.forEach(controllerGroup => {
            if (controllerGroup.childNodes && controllerGroup.childNodes.length) {
                container.appendChild(controllerGroup);
            }
        });

        return container;
    }
}
