import { TOOL_BAR_TAG, DRAW_BAR_PLUGIN_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, SEARCH_PLUGIN_TAG, MEASURE_PLUGIN_TAG, LAYER_MANAGER_PLUGIN_TAG, FULL_SCREEN_PLUGIN_TAG, DROP_DOWN_PLUGIN_TAG, CUSTOM_DROP_DOWN_PLUGIN_TAG, CUSTOM_SETTINGS_TAG, CUSTOM_EXPORT_TAG } from '../../../../utils/statics';
import _ from 'lodash';
import L from 'leaflet';
import Utils from '../../../../utils/utilities';
import store from "../../../store/store";
// import { reaction } from 'mobx';
export class ToolBar {
    constructor() {
        this.compName = TOOL_BAR_TAG;
        this.toolbarFeaturesDecision = this.toolbarFeaturesDecision.bind(this);
    }
    componentWillLoad() {
        this.element = this.createElement();
    }
    render() {
        return (h("div", null,
            h("layer-manager-plugin", { gisMap: this.gisMap, config: this.config.toolbarPluginsConfig.layerManagerConfig }),
            _.get(this, 'config.isSettings') ? (h("custom-settings", { gisMap: this.gisMap })) : (''),
            _.get(this, 'config.isExport') ? (h("custom-export", { gisMap: this.gisMap })) : (''),
            _.get(this, 'config.toolbarPluginsConfig.drawBarConfig.enable') ? (h("draw-bar-plugin", { gisMap: this.gisMap, config: this.config.toolbarPluginsConfig.drawBarConfig })) : (''),
            _.get(this, "config.toolbarPluginsConfig.zoomToExtentConfig.enable") ? (h("zoom-to-extent-plugin", { gisMap: this.gisMap, config: this.config.toolbarPluginsConfig.zoomToExtentConfig })) : (''),
            _.get(this, "config.toolbarPluginsConfig.fullScreenConfig.enable") ? (h("full-screen-plugin", { gisMap: this.gisMap, config: this.config.toolbarPluginsConfig.fullScreenConfig })) : (''),
            _.get(this, "config.toolbarPluginsConfig.measureConfig.enable") ? (h("measure-plugin", { gisMap: this.gisMap, config: this.config.toolbarPluginsConfig.measureConfig })) : (''),
            _.get(this, "config.toolbarPluginsConfig.searchConfig.enable") ? (h("search-plugin", { gisMap: this.gisMap, config: this.config.toolbarPluginsConfig.searchConfig })) : ('')));
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        // this.createElement();
        this.gisMap.addControl(this.element);
        Utils.fitLayerControllerPosition();
    }
    createElement() {
        try {
            let customControl = L.Control.extend({
                options: { position: 'topleft' },
                onAdd: this.toolbarFeaturesDecision
            });
            return new customControl();
        }
        catch (e) {
            console.error('failed to create custom control: ' + e);
            return null;
        }
    }
    toolbarFeaturesDecision() {
        // // create toolbar wrapper controller groups
        const controllerSettingsGroup = L.DomUtil.create('div', 'custom-toolbar-group');
        const controllerDrawGroup = L.DomUtil.create('div', 'custom-toolbar-group');
        const controllerMapGroup = L.DomUtil.create('div', 'custom-toolbar-group');
        const controllerSearchGroup = L.DomUtil.create('div', 'custom-toolbar-group');
        const controllerActionsGroup = L.DomUtil.create('div', 'custom-toolbar-group');
        const controllerImportExportGroup = L.DomUtil.create('div', 'custom-toolbar-group');
        const container = L.DomUtil.create('div', 'custom-toolbar leaflet-draw-toolbar leaflet-bar');
        if (store.state.mapConfig.isZoomControl) {
            const zoomController = this.gisMap.getContainer().querySelector('.leaflet-control-zoom');
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
        let toolbarPlugins = this.el.children[0];
        _.forEach(toolbarPlugins.children, (plugin) => {
            let htmlElement = null;
            let container;
            let controlList;
            switch (plugin.tagName.toLowerCase()) {
                case CUSTOM_SETTINGS_TAG: {
                    let settingsTag = plugin;
                    let customDropDownPluginEl = settingsTag.querySelector(`${CUSTOM_DROP_DOWN_PLUGIN_TAG}`);
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
                    htmlElement = plugin.getHtmlBtEl();
                    if (htmlElement) {
                        controlList = controllerGroupMap[LAYER_MANAGER_PLUGIN_TAG];
                        controlList.forEach(cg => {
                            cg.appendChild(htmlElement);
                        });
                    }
                    break;
                }
                case DRAW_BAR_PLUGIN_TAG: {
                    container = plugin.getControl().getContainer();
                    let drawBar = container.childNodes[0];
                    drawBar.id = "draw-shapes-section"; // setting id for future styling purposes
                    controlList = controllerGroupMap[DRAW_BAR_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        const childs = container.childNodes;
                        if (childs && childs.length) {
                            cg.appendChild(childs[0]);
                        }
                    });
                    break;
                }
                case ZOOM_TO_EXTENT_PLUGIN_TAG: {
                    container = plugin.getControl().getContainer();
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
                    container = plugin.getControl().getContainer();
                    container.classList.add('polyline-measure');
                    controlList = controllerGroupMap[MEASURE_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(container);
                    });
                    break;
                }
                case SEARCH_PLUGIN_TAG: {
                    container = plugin.getControl().getContainer();
                    Utils.stopDoubleClickOnPlugin(container);
                    controlList = controllerGroupMap[SEARCH_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(container);
                    });
                    break;
                }
                case CUSTOM_EXPORT_TAG: {
                    let exportTag = plugin;
                    let dropDownPluginEl = exportTag.querySelector(`${DROP_DOWN_PLUGIN_TAG}`);
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
    static get is() { return "tool-bar"; }
    static get properties() { return { "config": { "type": "Any", "attr": "config" }, "el": { "elementRef": true }, "element": { "state": true }, "exportDropDownData": { "state": true }, "gisMap": { "type": "Any", "attr": "gis-map" }, "settingsDropDownData": { "state": true } }; }
    static get style() { return "/**style-placeholder:tool-bar:**/"; }
}
