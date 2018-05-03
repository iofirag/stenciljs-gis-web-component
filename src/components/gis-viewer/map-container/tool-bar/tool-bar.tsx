import { Component, Prop, State, Element } from '@stencil/core';
import { TOOL_BAR_TAG, DRAW_BAR_PLUGIN_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, SEARCH_PLUGIN_TAG,
    MEASURE_PLUGIN_TAG, LAYER_MANAGER_PLUGIN_TAG, FULL_SCREEN_PLUGIN_TAG, DROP_DOWN_PLUGIN_TAG,
    CUSTOM_DROP_DOWN_PLUGIN_TAG, CUSTOM_SETTINGS_TAG, CUSTOM_EXPORT_TAG } from '../../../../utils/statics';
import _ from 'lodash';
import { ToolbarConfig } from '../../../../models';
import L from 'leaflet';
import Utils from '../../../../utils/utilities';
import store from "../../../store/store";
// import { reaction } from 'mobx';

@Component({
    tag: 'tool-bar',
    styleUrls: [
        './tool-bar.scss'
    ]
})
export class ToolBar {

    compName: string = TOOL_BAR_TAG;
    @Prop() gisMap: L.Map;
    @Prop() config: ToolbarConfig;
    // @Prop() isZoomControl: boolean;
    // @Prop() mouseCoordinateConfig: MouseCoordinateConfig;
    // @Prop() clusterHeatMode: ClusterHeat;

    @Element() el: HTMLElement;
    // @State() isZoomControlState;
    @State() element: L.Control;
    @State() exportDropDownData: any[];
    @State() settingsDropDownData: any[];

    constructor() {
      this.toolbarFeaturesDecision = this.toolbarFeaturesDecision.bind(this);
    }

    componentWillLoad() {
      this.element = this.createElement();
    }

    render() {

        return (
            <div>
                <layer-manager-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.layerManagerConfig} />
                {
                  _.get(this, 'config.isSettings', false) ? (
                      <custom-settings gisMap={this.gisMap} />
                  ) : null
                }
                {
                  _.get(this, 'config.isExport', false) ? (
                      <custom-export gisMap={this.gisMap} />
                  ) : null
                }
                {
                  _.get(this, 'config.toolbarPluginsConfig.zoomToExtentConfig.enable', false) ? (
                      <zoom-to-extent-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.zoomToExtentConfig} />
                  ) : null
                }
                {
                  _.get(this, 'config.toolbarPluginsConfig.fullScreenConfig.enable', false) ? (
                      <full-screen-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.fullScreenConfig} />
                  ) : null
                }
                {
                  _.get(this, 'config.toolbarPluginsConfig.measureConfig.enable', false) ? (
                      <measure-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.measureConfig} />
                  ) : null
                }
                {
                  _.get(this, 'config.toolbarPluginsConfig.searchConfig.enable', false) ? (
                      <search-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.searchConfig} />
                  ) : null
                }
            </div>
        );
    }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        // this.createElement();
        this.gisMap.addControl(this.element);
        Utils.fitLayerControllerPosition();
    }

    private createElement(): L.Control {
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

        if (store.state.mapConfig.isZoomControl) {
            const zoomController: HTMLElement = this.gisMap.getContainer().querySelector('.leaflet-control-zoom') as HTMLElement;
            controllerMapGroup.appendChild(zoomController);
        }

        const controllerGroupMap = {
            [LAYER_MANAGER_PLUGIN_TAG]: [controllerMapGroup],
            [DRAW_BAR_PLUGIN_TAG]: [controllerDrawGroup, controllerActionsGroup],
            [MEASURE_PLUGIN_TAG]: [controllerDrawGroup],
            [SEARCH_PLUGIN_TAG]: [controllerSearchGroup],
            [ZOOM_TO_EXTENT_PLUGIN_TAG]: [controllerMapGroup],
            [FULL_SCREEN_PLUGIN_TAG]: [controllerMapGroup],
            [CUSTOM_EXPORT_TAG]: [controllerImportExportGroup],
            [CUSTOM_SETTINGS_TAG]: [controllerSettingsGroup],
        };

        let toolbarPlugins: Element = this.el.children[0];
        _.forEach(toolbarPlugins.children, (plugin: HTMLElement) => {

            let htmlElement: HTMLElement = null;
            let container: HTMLElement;
            let controlList: HTMLElement[];

            switch(plugin.tagName.toLowerCase()) {

                case CUSTOM_SETTINGS_TAG: {
                    let settingsTag = (plugin as HTMLCustomSettingsElement);
                    let customDropDownPluginEl: HTMLCustomDropDownPluginElement = settingsTag.querySelector(`${CUSTOM_DROP_DOWN_PLUGIN_TAG}`);
                    if (customDropDownPluginEl) {
                        container = customDropDownPluginEl.getControl().getContainer();
                        Utils.stopDoubleClickOnPlugin(container);
                        controlList = controllerGroupMap[CUSTOM_SETTINGS_TAG];
                        controlList.forEach(cg => {
                            cg.appendChild(container);
                        });
                    }
                    break;
                }

                case LAYER_MANAGER_PLUGIN_TAG: {
                  let drawBarPluginEl: HTMLDrawBarPluginElement = (plugin as HTMLLayerManagerPluginElement).querySelector(`${DRAW_BAR_PLUGIN_TAG}`);
                  if (drawBarPluginEl) {
                    container = drawBarPluginEl.getControl().getContainer();
                    const drawBar: HTMLElement = container.childNodes[0] as HTMLElement;
                    drawBar.id = "draw-shapes-section"; // setting id for future styling purposes

                    controlList = controllerGroupMap[DRAW_BAR_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        const childs = container.childNodes;
                        if (childs && childs.length) {
                            cg.appendChild(childs[0]);
                        }
                    });
                  }

                  // Layer manager
                  htmlElement = (plugin as HTMLLayerManagerPluginElement).getHtmlBtEl();
                  if (htmlElement) {
                      controlList = controllerGroupMap[LAYER_MANAGER_PLUGIN_TAG];
                      controlList.forEach(cg => {
                          cg.appendChild(htmlElement);
                      });
                  }
                  break;
                }

                case ZOOM_TO_EXTENT_PLUGIN_TAG: {
                    container = (plugin as HTMLZoomToExtentPluginElement).getControl().getContainer();
                    Utils.stopDoubleClickOnPlugin(container);

                    controlList = controllerGroupMap[ZOOM_TO_EXTENT_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(container);
                    });
                    break;
                }

                case FULL_SCREEN_PLUGIN_TAG: {
                    // container = (plugin as HTMLFullScreenPluginElement).getControl().getContainer();
                    // container.classList.remove('leaflet-bar', 'leaflet-control');
                    // Utils.stopDoubleClickOnPlugin(container);
                    // controlList = controllerGroupMap[FULL_SCREEN_PLUGIN_TAG];
                    // controlList.forEach(cg => {
                    //     cg.appendChild(container);
                    // });
                    break;
                }

                case MEASURE_PLUGIN_TAG: {
                    container = (plugin as HTMLMeasurePluginElement).getControl().getContainer();
                    container.classList.add('polyline-measure');

                    controlList = controllerGroupMap[MEASURE_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(container);
                    });
                    break;
                }

                case SEARCH_PLUGIN_TAG: {
                    container = (plugin as HTMLSearchPluginElement).getControl().getContainer();
                    Utils.stopDoubleClickOnPlugin(container);

                    controlList = controllerGroupMap[SEARCH_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(container);
                    });
                    break;
                }

                case CUSTOM_EXPORT_TAG: {
                    let exportTag = (plugin as HTMLCustomExportElement);
                    let dropDownPluginEl: HTMLDropDownPluginElement = exportTag.querySelector(`${DROP_DOWN_PLUGIN_TAG}`);
                    if (dropDownPluginEl) {
                        container = dropDownPluginEl.getControl().getContainer();
                        Utils.stopDoubleClickOnPlugin(container);
                        controlList = controllerGroupMap[CUSTOM_EXPORT_TAG];
                        controlList.forEach(cg => {
                            cg.appendChild(container);
                        });
                    }
                    break;
                }
            }
        })

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
