import { Component, Prop, State, Element} from '@stencil/core';
import { TOOL_BAR_TAG, DRAW_BAR_PLUGIN_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, SEARCH_PLUGIN_TAG, MEASURE_PLUGIN_TAG, LAYER_MANAGER_PLUGIN_TAG, FULL_SCREEN_PLUGIN_TAG } from '../../../../utils/statics';
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
    @Prop() isZoomControl: boolean;
    
    @State() element: L.Control;

    @Element() el: HTMLElement;
    
    constructor() {
        this.toolbarFeaturesDecision = this.toolbarFeaturesDecision.bind(this);
    }

    componentWillUpdate() {
        this.isZoomControl = _.get(this, 'isZoomControl', true);
    }

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
        Utils.log_componentDidLoad(this.compName);
        this.createElement();
    }

    private createElement(): void {
        this.element = this.addToolbarControl();
        this.gisMap.addControl(this.element);
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

        const container: HTMLElement = L.DomUtil.create('div', 'custom-toolbar leaflet-draw-toolbar leaflet-bar');
        // Draw
        // let drawBar: HTMLElement;
        // let editDrawBar: HTMLElement;
        // const settingsControllerName = FeaturesNames.CUSTOM_DROP_DOWN_COMP + '_' + CustomControlName.SETTINGS;
        
        // me.features
        // let drawBarPluginEl: HTMLDrawBarPluginElement = document.querySelector(`${DRAW_BAR_PLUGIN_TAG}`);
        // if (drawBarPluginEl) {
        // //     const drawBarLeafletElement: any = this.features[FeaturesNames.DRAWBAR_COMP].element;
        // //     this.addFeatureToMap(drawBarLeafletElement);
        //     let drawBar: HTMLElement = drawBarPluginEl.getControl().getContainer().childNodes[0] as HTMLElement;
        // //     // setting id for future styling purposes
        //     drawBar.id = "draw-shapes-section";
        //     // let editDrawBar: HTMLElement = drawBarPluginEl.drawControl.getContainer().childNodes[1] as HTMLElement;
        // }

        // if (this.context.props.zoomControl && this.context.props.zoomControl.enable) {
        if (this.isZoomControl) {
            const zoomController: HTMLElement = document.querySelector('.leaflet-control-zoom') as HTMLElement;
            controllerMapGroup.appendChild(zoomController);
        }
        // }

        // let zoomToExtentPluginEl: HTMLZoomToExtentPluginElement = document.querySelector(`${ZOOM_TO_EXTENT_PLUGIN_TAG}`);
        // if (zoomToExtentPluginEl) {
        // // if (this.features[FeaturesNames.ZOOM_TO_EXTEND_COMP]) {
        //     // const zoomToExtendLeafletElement: any = this.features[FeaturesNames.ZOOM_TO_EXTEND_COMP].element;
        //     // this.addFeatureToMap(zoomToExtendLeafletElement);
        //     // Stop double click on plugin
        //     Utils.stopDoubleClickOnPlugin(zoomToExtentPluginEl.getControl().getContainer());
        // }

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

        // let searchPluginEl: HTMLSearchPluginElement = document.querySelector(`${SEARCH_PLUGIN_TAG}`);
        // if (searchPluginEl) {
        //     // const searchLeafletElement: any = this.features[FeaturesNames.SEARCH_BOX_COMP].element;
        //     // this.addFeatureToMap(searchLeafletElement);
        //     // this.features[FeaturesNames.SEARCH_BOX_COMP].fixCss();
        //     // Stop double click on plugin
        //     Utils.stopDoubleClickOnPlugin(searchPluginEl.getControl().getContainer());
        // }

        // Measure
        // let measurePluginEl: HTMLMeasurePluginElement = document.querySelector(`${MEASURE_PLUGIN_TAG}`);
        // if (measurePluginEl) {
        // // if (this.features[FeaturesNames.MEASURE_COMP]) {
        //     // const measureLeafletElement: any = this.features[FeaturesNames.MEASURE_COMP].element;
        //     // this.addFeatureToMap(measureLeafletElement);
        //     const measure: HTMLElement = measurePluginEl.getControl().getContainer();
        //     measure.classList.add('polyline-measure');
        // }

        

        const controllerGroupMap = {
            // [FeaturesNames.LAYERS_CONTROLLER_COMP]: [controllerMapGroup],
            // [FeaturesNames.DRAWBAR_COMP]: [controllerDrawGroup, controllerActionsGroup],
            // [FeaturesNames.MEASURE_COMP]: [controllerDrawGroup],
            // [FeaturesNames.SEARCH_BOX_COMP]: [controllerSearchGroup],
            // [FeaturesNames.ZOOM_TO_EXTEND_COMP]: [controllerMapGroup],
            // [FeaturesNames.DROP_DOWN_COMP]: [controllerImportExportGroup],
            // [FeaturesNames.CUSTOM_DROP_DOWN_COMP + '_' + CustomControlName.SETTINGS]: [controllerSettingsGroup],

            [LAYER_MANAGER_PLUGIN_TAG]: [controllerMapGroup],
            [DRAW_BAR_PLUGIN_TAG]: [controllerDrawGroup, controllerActionsGroup],
            [MEASURE_PLUGIN_TAG]: [controllerDrawGroup],
            [SEARCH_PLUGIN_TAG]: [controllerSearchGroup],
            [ZOOM_TO_EXTENT_PLUGIN_TAG]: [controllerMapGroup],
            // [FeaturesNames.DROP_DOWN_COMP]: [controllerImportExportGroup],
            // [FeaturesNames.CUSTOM_DROP_DOWN_COMP + '_' + CustomControlName.SETTINGS]: [controllerSettingsGroup],
        };


        // Feature iterate
        
        // const toolbarEl: HTMLToolBarElement = document.querySelector(`${TOOL_BAR_TAG}`);
        let toolbarPlugins: Element = this.el.children[0];
        _.forEach(toolbarPlugins.children, (plugin: HTMLElement) => {
            
            let htmlElement: HTMLElement = null;

            switch(plugin.tagName.toLowerCase()) {
                case LAYER_MANAGER_PLUGIN_TAG:
                break;

                case DRAW_BAR_PLUGIN_TAG:
                break;

                case ZOOM_TO_EXTENT_PLUGIN_TAG:
                break;

                case 
                case                 
            }
            if (plugin.tagName.toLowerCase() === LAYER_MANAGER_PLUGIN_TAG) {
                htmlElement = (plugin as HTMLLayerManagerPluginElement).getHtmlBtEl();

                const controlList = controllerGroupMap[LAYER_MANAGER_PLUGIN_TAG];
                controlList.forEach(cg => {
                    cg.appendChild(htmlElement);
                });
            } else if (plugin.tagName.toLowerCase() === DRAW_BAR_PLUGIN_TAG) {
                let drawBar: HTMLElement = (plugin as HTMLDrawBarPluginElement).getControl().getContainer().childNodes[0] as HTMLElement;
                // setting id for future styling purposes
                drawBar.id = "draw-shapes-section";

                htmlElement = (plugin as HTMLDrawBarPluginElement).getControl().getContainer();

                const controlList = controllerGroupMap[DRAW_BAR_PLUGIN_TAG];
                controlList.forEach(cg => {
                    const childs = htmlElement.childNodes;
                    if (childs && childs.length) {
                        cg.appendChild(childs[0]);
                    }
                });
            } else if (plugin.tagName.toLowerCase() === ZOOM_TO_EXTENT_PLUGIN_TAG) {
                debugger
                const container: HTMLElement = (plugin as HTMLZoomToExtentPluginElement).getControl().getContainer();
                Utils.stopDoubleClickOnPlugin(container);

                htmlElement = (plugin as HTMLZoomToExtentPluginElement).getControl().getContainer();

                const controlList = controllerGroupMap[ZOOM_TO_EXTENT_PLUGIN_TAG];
                controlList.forEach(cg => {
                    cg.appendChild(htmlElement);
                });
            } else if (plugin.tagName.toLowerCase() === FULL_SCREEN_PLUGIN_TAG) {
                debugger
            } else if (plugin.tagName.toLowerCase() === MEASURE_PLUGIN_TAG) {
                debugger
                const container: HTMLElement = (plugin as HTMLMeasurePluginElement).getControl().getContainer();
                container.classList.add('polyline-measure');

                htmlElement = (plugin as HTMLMeasurePluginElement).getControl().getContainer();

                const controlList = controllerGroupMap[MEASURE_PLUGIN_TAG];
                controlList.forEach(cg => {
                    cg.appendChild(htmlElement);
                });
            } else if (plugin.tagName.toLowerCase() === SEARCH_PLUGIN_TAG) {
                debugger
                const container: HTMLElement = (plugin as HTMLSearchPluginElement).getControl().getContainer();
                Utils.stopDoubleClickOnPlugin(container);

                htmlElement = (plugin as HTMLSearchPluginElement).getControl().getContainer();

                const controlList = controllerGroupMap[SEARCH_PLUGIN_TAG];
                controlList.forEach(cg => {
                    cg.appendChild(htmlElement);
                });
            }
            console.log(htmlElement)
        })
        // this.toolbarEnabledPlugins.forEach((featureKey: string) => {
        //     // draw or zoomToExtend
        //     if (this.features[featureKey]) {
        //         let htmlElement: HTMLElement = null;
        //         if (featureKey === FeaturesNames.LAYERS_CONTROLLER_COMP) {
        //             htmlElement = this.features[featureKey].htmlBtElement;
        //         } else {
        //             htmlElement = this.features[featureKey].element._container;
        //         }

        //         const controlList = controllerGroupMap[featureKey];
        //         controlList.forEach(cg => {
        //             if (featureKey === FeaturesNames.DRAWBAR_COMP) {
        //                 // Special case for drawBar_comp
        //                 const childs = htmlElement.childNodes;
        //                 if (childs && childs.length) {
        //                     cg.appendChild(childs[0]);
        //                 }
        //             } else {
        //                 cg.appendChild(htmlElement);
        //             }
        //         });
        //     }
        // });

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
