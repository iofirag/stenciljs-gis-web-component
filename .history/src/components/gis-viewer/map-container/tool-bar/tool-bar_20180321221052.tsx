import { Component, Prop, State, Element} from '@stencil/core';
import { TOOL_BAR_TAG, DRAW_BAR_PLUGIN_TAG, ZOOM_TO_EXTENT_PLUGIN_TAG, SEARCH_PLUGIN_TAG, MEASURE_PLUGIN_TAG, LAYER_MANAGER_PLUGIN_TAG, FULL_SCREEN_PLUGIN_TAG, FILE_TYPES, DROP_DOWN_PLUGIN_TAG, CUSTOM_DROP_DOWN_PLUGIN_TAG } from '../../../../utils/statics';
import _ from 'lodash';
import { ToolbarConfig, DistanceUnitType, DropDownItemType, MouseCoordinateConfig } from '../../../../models';
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
    @Prop() mouseCoordinateConfig: MouseCoordinateConfig;
    
    @Element() el: HTMLElement;
    @State() isZoomControlState;
    @State() element: L.Control;
    @State() exportDropDownData: any[];
    @State() settingsDropDownData: any[];

    constructor() {
        this.toolbarFeaturesDecision = this.toolbarFeaturesDecision.bind(this);
    }

    componentWillLoad() {
        this.isZoomControlState = _.get(this, 'isZoomControl', true);
        
        this.exportDropDownData = [{
            label: 'Export KML',
            onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.kml, {}, null, 'onSaveKmlBlob'),
            className: 'icon-kml'
        }, {
            label: 'Export CSV',
            onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.csv, {}, null, 'onSaveCsvBlob'),
            className: 'icon-csv'
        }, {
            label: 'Export SHP',
            onClick: Utils.exportBlobFactory.bind(this, FILE_TYPES.zip, {}, null, 'onSaveShpBlob'),
            className: 'icon-shp'
        }];
    }

    render() {
        const coordinateSystemToolbarData = _.get(this.config., 'props.mouseCoordinate.enable')
            ? {
                title: 'Coordinate system',
                itemList: [
                    {
                        label: CoordinateType.MGRS,
                        iconClassName: 'icon-pin',
                        onClick: null,//MouseCoordintatePlugin.changeMouseCoordinates,
                        name: 'coordinates',
                        type: DropDownItemType.RADIO_BUTTON,
                        isSelected: true //!!_.get(context, 'props.mouseCoordinate.utmref'),
                    }, {
                        label: CoordinateType.UTM,
                        iconClassName: 'icon-pin',
                        onClick: null,//MouseCoordintatePlugin.changeMouseCoordinates,
                        name: 'coordinates',
                        type: DropDownItemType.RADIO_BUTTON,
                        isSelected: true //!!_.get(context, 'props.mouseCoordinate.utm'),
                    }, {
                        label: CoordinateType.DECIMAL,
                        iconClassName: 'icon-pin',
                        onClick: null,//MouseCoordintatePlugin.changeMouseCoordinates,
                        name: 'coordinates',
                        type: DropDownItemType.RADIO_BUTTON,
                        isSelected: true //!!_.get(context, 'props.mouseCoordinate.gps'),
                    }
                ],
            }
            : null;

        const toolbarLayerSettingsConfig = _.get(this, 'config.toolbarPluginsConfig.layerManagerConfig.enable')
            ? {
                title: 'Layers',
                itemList: [
                    {
                        label: LayersTypeLabel.HEAT,
                        iconClassName: 'icon-heatmap',
                        onClick: this.onChangeMapMode,
                        name: 'layers',
                        type: DropDownItemType.RADIO_BUTTON,
                        isSelected: this.context.mapSettings.mode === 'heat',
                    }, {
                        label: LayersTypeLabel.CLUSTER,
                        iconClassName: 'icon-cluster',
                        onClick: this.onChangeMapMode,
                        name: 'layers',
                        type: DropDownItemType.RADIO_BUTTON,
                        isSelected: this.context.mapSettings.mode === 'cluster',
                    },],
            }
            : null;

        const vectorsData = {
            title: 'Vectors Data',
            itemList: [
                {
                    label: 'Cell Data Towers',
                    // iconClassName: 'icon-cluster',
                    onClick: this.onChangeCDT,
                    name: 'Cell Data Towers',
                    type: DropDownItemType.CHECK_BOX,
                    isSelected: this.is .mapSettings.mode === 'cluster',
                },
            ]
        };

        const dropDownData = [coordinateSystemToolbarData, toolbarLayerSettingsConfig/*, vectorsData*/];

        const settingsDropDownData = _.filter(dropDownData, (item) => item !== null);

        return (
            <div>
                <layer-manager-plugin gisMap={this.gisMap} config={this.config.toolbarPluginsConfig.layerManagerConfig} />
                {
                    _.get(this, 'config.isSettings') ? (
                        <custom-drop-down-plugin gisMap={this.gisMap} dropDownData={settingsDropDownData} customControlName={'Export Map'} dropDownTitle={'Settings'} />
                    ) : ('')
                }
                {
                    _.get(this, 'config.isExport') ? (
                        <drop-down-plugin gisMap={this.gisMap} dropDownData={this.exportDropDownData} dropDownTitle={'Export Map'} />
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
        if (this.isZoomControlState) {
            const zoomController: HTMLElement = this.gisMap.getContainer().querySelector('.leaflet-control-zoom') as HTMLElement;
            controllerMapGroup.appendChild(zoomController);
        }

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
            [FULL_SCREEN_PLUGIN_TAG]: [controllerMapGroup],
            [DROP_DOWN_PLUGIN_TAG]: [controllerImportExportGroup],
            [CUSTOM_DROP_DOWN_PLUGIN_TAG]: [controllerSettingsGroup],
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
                    container = (plugin as HTMLDrawBarPluginElement).getControl().getContainer();
                    let drawBar: HTMLElement = container.childNodes[0] as HTMLElement;
                    drawBar.id = "draw-shapes-section"; // setting id for future styling purposes

                    controlList = controllerGroupMap[DRAW_BAR_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        const childs = container.childNodes;
                        if (childs && childs.length) {
                            cg.appendChild(childs[0]);
                        }
                    });
                    break;

                case ZOOM_TO_EXTENT_PLUGIN_TAG:
                    container = (plugin as HTMLZoomToExtentPluginElement).getControl().getContainer();
                    Utils.stopDoubleClickOnPlugin(container);

                    controlList = controllerGroupMap[ZOOM_TO_EXTENT_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(container);
                    });
                    break;

                case FULL_SCREEN_PLUGIN_TAG:
                    // container = (plugin as HTMLFullScreenPluginElement).getControl().getContainer();
                    // container.classList.remove('leaflet-bar', 'leaflet-control');
                    // Utils.stopDoubleClickOnPlugin(container);
                    // controlList = controllerGroupMap[FULL_SCREEN_PLUGIN_TAG];
                    // controlList.forEach(cg => {
                    //     cg.appendChild(container);
                    // });
                    break;

                case MEASURE_PLUGIN_TAG:
                    container = (plugin as HTMLMeasurePluginElement).getControl().getContainer();
                    container.classList.add('polyline-measure');

                    controlList = controllerGroupMap[MEASURE_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(container);
                    });
                    break;

                case SEARCH_PLUGIN_TAG:    
                    container = (plugin as HTMLSearchPluginElement).getControl().getContainer();
                    Utils.stopDoubleClickOnPlugin(container);

                    controlList = controllerGroupMap[SEARCH_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(container);
                    });
                    break;

                case DROP_DOWN_PLUGIN_TAG:
                    // Stop double click on plugin
                    container = (plugin as HTMLDropDownPluginElement).getControl().getContainer();
                    Utils.stopDoubleClickOnPlugin(container);

                    controlList = controllerGroupMap[DROP_DOWN_PLUGIN_TAG];
                    controlList.forEach(cg => {
                        cg.appendChild(container);
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
