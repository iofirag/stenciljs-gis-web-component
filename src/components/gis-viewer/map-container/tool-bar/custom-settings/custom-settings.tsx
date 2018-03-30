import { Component, Prop, Element, Method } from "@stencil/core";
import Utils from "../../../../../utils/utilities";
import { DropDownItemType, CoordinateSystemType, ClusterHeat } from "../../../../../models";
import store from "../../../../store/store";
import _ from "lodash";
import { LayersTypeLabel, CoordinateType, CUSTOM_SETTINGS_TAG, CUSTOM_DROP_DOWN_PLUGIN_TAG } from "../../../../../utils/statics";
import { reaction } from "mobx";
// import _ from "lodash";
// import store from "../../../../store/store";

@Component({
    tag: 'custom-settings',
    styleUrls: [
        `./custom-settings.scss`
    ]
})
export class CustomSettings {
    compName: string = CUSTOM_SETTINGS_TAG;
    @Prop() gisMap: L.Map
    @Element() el: HTMLElement;

    customDropDownPluginEl: HTMLCustomDropDownPluginElement;

    @Method()
    getElement(): HTMLElement {
        return this.el;
    }

    componentWillLoad() {
    }


    render() {
        const coordinateSystemToolbarData = store.state.mapPluginsConfig.mouseCoordinateConfig.enable
            ? {
                title: 'Coordinate system',
                itemList: [
                    {
                        label: CoordinateType.MGRS,
                        value: CoordinateType.MGRS.toLowerCase(),
                        iconClassName: 'icon-pin',
                        name: 'coordinates',
                        type: DropDownItemType.RADIO_BUTTON,
                        storeValue: store.state.mapConfig.coordinateSystemType,
                        changeAction: store.changeCoordinates,
                    }, {
                        label: CoordinateType.UTM,
                        value: CoordinateType.UTM.toLowerCase(),
                        iconClassName: 'icon-pin',
                        name: 'coordinates',
                        type: DropDownItemType.RADIO_BUTTON,
                        storeValue: store.state.mapConfig.coordinateSystemType,
                        changeAction: store.changeCoordinates,
                    }, {
                        label: CoordinateType.DECIMAL,
                        value: CoordinateType.DECIMAL.toLowerCase(),
                        iconClassName: 'icon-pin',
                        name: 'coordinates',
                        type: DropDownItemType.RADIO_BUTTON,
                        storeValue: store.state.mapConfig.coordinateSystemType,
                        changeAction: store.changeCoordinates
                    }
                ],
            }
            : null;

        const toolbarLayerSettingsConfig = store.state.toolbarConfig.toolbarPluginsConfig.layerManagerConfig.enable
            ? {
                title: 'Layers',
                itemList: [
                    {
                        label: LayersTypeLabel.HEAT,
                        value: LayersTypeLabel.HEAT.toLowerCase(),
                        iconClassName: 'icon-heatmap',
                        name: 'layers',
                        type: DropDownItemType.RADIO_BUTTON,
                        storeValue: store.state.mapConfig.mode,
                        changeAction: store.changeMapMode
                    }, {
                        label: LayersTypeLabel.CLUSTER,
                        value: LayersTypeLabel.CLUSTER.toLowerCase(),
                        iconClassName: 'icon-cluster',
                        name: 'layers',
                        type: DropDownItemType.RADIO_BUTTON,
                        storeValue: store.state.mapConfig.mode,
                        changeAction: store.changeMapMode
                    },],
            }
            : null;

        const vectorsData = {
            title: 'Vectors Data',
            itemList: [
                {
                    label: 'Cell Data Towers',
                    // iconClassName: 'icon-cluster',
                    onClick: null, // this.onChangeCDT,
                    name: 'Cell Data Towers',
                    type: DropDownItemType.CHECK_BOX,
                    isSelected: false,
                },
            ]
        }; console.log(vectorsData);

        const dropDownData = [coordinateSystemToolbarData, toolbarLayerSettingsConfig , vectorsData];

        const settingsDropDownData = _.filter(dropDownData, (item) => item !== null);
        // Utils.doNothing([settingsDropDownData])
        return (
            <custom-drop-down-plugin gisMap={this.gisMap} dropDownData={settingsDropDownData} customControlName={'settings'} dropDownTitle={'Settings'} />
        )
    }

    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.customDropDownPluginEl = this.el.querySelector(`${CUSTOM_DROP_DOWN_PLUGIN_TAG}`);
        reaction(
            () => store.state.mapConfig.coordinateSystemType,
            coordinateSystemType => {
                this.coordinateChangeHandler(coordinateSystemType);
            }
        );
        reaction(
            () => store.state.mapConfig.mode,
            mode => {
                this.clusterHeatChangeHandler(mode);
            }
        );
        Utils.fitLayerControllerPosition();
    }

    private coordinateChangeHandler(coordinateSystemType: CoordinateSystemType) {
        // Update newer check item
        this.setRadioButtonsByCheckedValue('coordinates', coordinateSystemType);
    }
    private clusterHeatChangeHandler(mode: ClusterHeat) {
        // Update newer check item
        this.setRadioButtonsByCheckedValue('layers', mode);
    }
    private setRadioButtonsByCheckedValue(groupName: string, checkedValue: any) {
        const groupItems: NodeListOf<Element> = this.customDropDownPluginEl.getControl().getContainer().querySelectorAll(`.menu li.menu-item.custom-group [name="${groupName}"]`);
        _.forEach(groupItems, (input: Element) => {
            // Unselect checked element
            if (input.getAttribute('checked')) {
                input.removeAttribute('checked');
            }
        });
        _.forEach(groupItems, (input: Element) => {
            // Selecet element
            if (input.getAttribute('value') === checkedValue) {
                input.setAttribute('checked', 'true');
            }
        });
    }

    componentDidUnload() {
        console.log(`componentDidUnload - ${this.compName}`);
        // this.gisMap.removeControl(this.control);
    }
}