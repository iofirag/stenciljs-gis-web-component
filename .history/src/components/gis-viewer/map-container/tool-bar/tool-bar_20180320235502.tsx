import { Component, Prop, State, Element} from '@stencil/core';
import { TOOL_BAR_TAG, DRAW_BAR_PLUGIN_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, SEARCH_PLUGIN_TAG, MEASURE_PLUGIN_TAG, LAYER_MANAGER_PLUGIN_TAG, FULL_SCREEN_PLUGIN_TAG, FILE_TYPES } from '../../../../utils/statics';
import _ from 'lodash';
import { ToolbarConfig, DistanceUnitType } from '../../../../models/apiModels';
import L from 'leaflet';
import Utils from '../../../../utils/utilities';


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
    @Prop() distanceUnitType: DistanceUnitType;
    @Prop() isZoomControl: boolean;
    
    @Element() el: HTMLElement;
    @State() element: L.Control;
    @State() exportDropDownData: any[];

    
    constructor() {
        this.toolbarFeaturesDecision = this.toolbarFeaturesDecision.bind(this);
    }

    componentWillUpdate() {
        this.isZoomControl = _.get(this, 'isZoomControl', true);
        this.exportDropDownData = [{
            label: 'Export KML',
            onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.kml, {}, null, this.gisMap, props.onSaveKmlBlob),
            className: 'icon-kml'
        }, {
            label: 'Export CSV',
                onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.csv, {}, null, this.gisMap, props.onSaveCsvBlob),
            className: 'icon-csv'
        },
        {
            label: 'Export SHP',
            onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.zip, {}, null, this.gisMap, props.onSaveShpBlob),
            className: 'icon-shp'
        }
    }

    render() {
        return (
            <div>
                <layer-manager-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.layerManagerConfig} />
                {
                    _.get(this, 'config.isExport') ? (
                        <drop-down-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.drawBarConfig} dropDownData={exportDropDownData} dropDownTitle={'Export Map'} />
                    ) : ('')
                }
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
                    _.get(this, "config.toolbarPluginsConfig.searchConfig.enable") ? (
                        <search-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.searchConfig} />
                    ) : ('')
                }
            </div>
        );
    }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.createElement();

        Utils.fitLayerControllerPosition();
    }

    private createElement(): void {
        this.element = this.addToolbarControl();
        this.gisMap.addControl(this.element);
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
            const zoomController: HTMLElement = this.gisMap.getContainer().querySelector('.leaflet-control-zoom') as HTMLElement;
            controllerMapGroup.appendChild(zoomController);
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

        const controllerGroupMap = {
            [LAYER_MANAGER_PLUGIN_TAG]: [controllerMapGroup],
            [DRAW_BAR_PLUGIN_TAG]: [controllerDrawGroup, controllerActionsGroup],
            [MEASURE_PLUGIN_TAG]: [controllerDrawGroup],
            [SEARCH_PLUGIN_TAG]: [controllerSearchGroup],
            [ZOOM_TO_EXTENT_PLUGIN_TAG]: [controllerMapGroup],
            // [FeaturesNames.DROP_DOWN_COMP]: [controllerImportExportGroup],
            // [FeaturesNames.CUSTOM_DROP_DOWN_COMP + '_' + CustomControlName.SETTINGS]: [controllerSettingsGroup],
        };
        
        let toolbarPlugins: Element = this.el.children[0];
        _.forEach(toolbarPlugins.children, (plugin: HTMLElement) => {
            
            let htmlElement: HTMLElement = null;
            let container: HTMLElement;
            let controlList: HTMLElement[];

            switch(plugin.tagName.toLowerCase()) {
                
                case LAYER_MANAGER_PLUGIN_TAG:
                    htmlElement = (plugin as HTMLLayerManagerPluginElement).getHtmlBtEl();

                    controlList = controllerGroupMap[LAYER_MANAGER_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(htmlElement);
                    });
                    break;

                case DRAW_BAR_PLUGIN_TAG:
                    let drawBar: HTMLElement = (plugin as HTMLDrawBarPluginElement).getControl().getContainer().childNodes[0] as HTMLElement;
                    drawBar.id = "draw-shapes-section"; // setting id for future styling purposes

                    htmlElement = (plugin as HTMLDrawBarPluginElement).getControl().getContainer();

                    controlList = controllerGroupMap[DRAW_BAR_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        const childs = htmlElement.childNodes;
                        if (childs && childs.length) {
                            cg.appendChild(childs[0]);
                        }
                    });
                    break;

                case ZOOM_TO_EXTENT_PLUGIN_TAG:
                    container = (plugin as HTMLZoomToExtentPluginElement).getControl().getContainer();
                    Utils.stopDoubleClickOnPlugin(container);

                    htmlElement = (plugin as HTMLZoomToExtentPluginElement).getControl().getContainer();

                    controlList = controllerGroupMap[ZOOM_TO_EXTENT_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(htmlElement);
                    });
                    break;

                case FULL_SCREEN_PLUGIN_TAG:
                    break;

                case MEASURE_PLUGIN_TAG:
                    container = (plugin as HTMLMeasurePluginElement).getControl().getContainer();
                    container.classList.add('polyline-measure');

                    htmlElement = (plugin as HTMLMeasurePluginElement).getControl().getContainer();

                    controlList = controllerGroupMap[MEASURE_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(htmlElement);
                    });
                    break;

                case SEARCH_PLUGIN_TAG:    
                    container = (plugin as HTMLSearchPluginElement).getControl().getContainer();
                    Utils.stopDoubleClickOnPlugin(container);

                    htmlElement = (plugin as HTMLSearchPluginElement).getControl().getContainer();

                    controlList = controllerGroupMap[SEARCH_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(htmlElement);
                    });
                    break;
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
