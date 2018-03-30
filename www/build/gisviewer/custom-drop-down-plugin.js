/*! Built with http://stenciljs.com */
const { h } = window.gisviewer;

import Utils, { CUSTOM_DROP_DOWN_PLUGIN_TAG, default$1 as L$1, default$2 as _, LayersTypeLabel, CoordinateType, CUSTOM_SETTINGS_TAG } from './chunk1.js';
import store, { reaction } from './chunk2.js';

// =========== SHAPES =========
var ShapeType;
(function (ShapeType) {
    ShapeType[ShapeType["CIRCLE"] = 0] = "CIRCLE";
    ShapeType[ShapeType["POLYGON"] = 1] = "POLYGON";
    ShapeType[ShapeType["MARKER"] = 2] = "MARKER";
    ShapeType[ShapeType["POLYLINE"] = 3] = "POLYLINE";
    ShapeType[ShapeType["LABEL"] = 4] = "LABEL";
    ShapeType[ShapeType["MULTIPOLYGON"] = 5] = "MULTIPOLYGON";
})(ShapeType || (ShapeType = {}));
var DropDownItemType;
(function (DropDownItemType) {
    DropDownItemType[DropDownItemType["REGULAR"] = 0] = "REGULAR";
    DropDownItemType[DropDownItemType["RADIO_BUTTON"] = 1] = "RADIO_BUTTON";
    DropDownItemType[DropDownItemType["CHECK_BOX"] = 2] = "CHECK_BOX";
})(DropDownItemType || (DropDownItemType = {}));

// export * from './shapeLayerContainer'

// import store from "../../../../store/store";
// import { reaction } from "mobx";
// import store from "../../../../store/store";
class CustomDropDownPlugin {
    constructor() {
        this.compName = CUSTOM_DROP_DOWN_PLUGIN_TAG;
    }
    getControl() {
        return this.control;
    }
    // constructor() {
    // }
    componentWillLoad() {
        Utils.log_componentWillLoad(this.compName);
    }
    // componentWillUpdate() {
    //     // debugger
    //     // this.control.customUpdate();
    // }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        const customControllerName = this.customControlName;
        this.control = this.createCustomControl(this.dropDownData, customControllerName, this.dropDownTitle);
        this.gisMap.addControl(this.control);
    }
    componentDidUnload() {
        Utils.log_componentDidUnload(this.compName);
        this.gisMap.removeControl(this.control);
    }
    createCustomControl(dropDownData, customControlName, dropDownTitle = '') {
        try {
            const customControl = L$1.Control.extend({
                options: {},
                onAdd: () => {
                    const container = L$1.DomUtil.create('div', 'leaflet-draw-toolbar leaflet-bar');
                    const menuBtn = L$1.DomUtil.create('a', 'btn-menu custom-icon ' + customControlName);
                    const list = L$1.DomUtil.create('ul', 'menu');
                    menuBtn.title = dropDownTitle;
                    menuBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        Utils.toggleCustomDropDownMenu(list);
                    });
                    // add list items according to the state (see received dropDownData structure)
                    _.reduce(dropDownData, (list, group /* , key: string */) => {
                        const li = L$1.DomUtil.create('li', 'menu-item custom-group');
                        // fill list item with the relevant markup according to the state
                        _.reduce(group.itemList, (li, item /* , key: string */) => {
                            const customGroupItem = this.createDropDownItem(item);
                            li.appendChild(customGroupItem);
                            return li;
                        }, li);
                        list.appendChild(li);
                        return list;
                    }, list);
                    container.appendChild(menuBtn);
                    container.appendChild(list);
                    return container;
                },
            }).bind(this);
            return new customControl();
        }
        catch (e) {
            console.error('failed to create custom control: ' + e);
            return null;
        }
    }
    createDropDownItem(dropDownDataItem) {
        const mainId = dropDownDataItem.name.replace(/\s+/g, '-').toLowerCase();
        const id = `${mainId}-${dropDownDataItem.label.replace(/\s+/g, '-').toLowerCase()}`;
        const gItem = L$1.DomUtil.create('div', 'group-item');
        const input = L$1.DomUtil.create('input', 'group-item-input');
        const label = L$1.DomUtil.create('label', 'group-item-input-label');
        const icon = L$1.DomUtil.create('i', 'group-item-icon ' + dropDownDataItem.iconClassName);
        gItem.appendChild(icon);
        gItem.appendChild(label);
        gItem.appendChild(input);
        const itemTemplate = {
            [DropDownItemType.RADIO_BUTTON]: () => {
                input.setAttribute('type', 'radio');
                input.setAttribute('name', dropDownDataItem.name);
                input.setAttribute('value', dropDownDataItem.label);
                input.setAttribute('id', id);
                /*to be able to click all over the item and switch between the radio buttons
                we need to disable all the click events on the this elements*/
                _.forEach(gItem.childNodes, (item) => {
                    item.style.pointerEvents = 'none';
                });
                // init selected item
                if (dropDownDataItem.value === dropDownDataItem.storeValue) {
                    input.setAttribute('checked', 'true');
                }
                // Set on click function
                gItem.addEventListener('click', () => {
                    dropDownDataItem.changeAction.bind(dropDownDataItem.value.toLowerCase());
                });
                label.innerText = dropDownDataItem.label.replace(/-/g, ' ');
                return gItem;
            },
            [DropDownItemType.CHECK_BOX]: () => {
                input.setAttribute('type', 'checkbox');
                input.setAttribute('value', dropDownDataItem.label);
                input.setAttribute('id', id);
                /*to be able to click all over the item and switch between the radio buttons
                we need to disable all the click events on the this elements*/
                _.forEach(gItem.childNodes, (item) => {
                    item.style.pointerEvents = 'none';
                });
                // add click event on the group item
                gItem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const allInputs = e.target.parentElement.querySelectorAll('.group-item-input');
                    // remove all 'checked' attributes (this attribute is in charge of selecting the radio button)
                    _.forEach(allInputs, (input) => {
                        input.removeAttribute('checked');
                    });
                    // select check box
                    e.target.childNodes[2].checked = !e.target.childNodes[2].checked;
                    dropDownDataItem.onClick(e.target.childNodes[2].value);
                });
                label.innerText = dropDownDataItem.label.replace(/-/g, ' ');
                return gItem;
            },
            [DropDownItemType.REGULAR]: () => {
                const gItem = L$1.DomUtil.create('div', 'group-item');
                return gItem;
            },
        };
        return itemTemplate[dropDownDataItem.type]();
    }
    static get is() { return "custom-drop-down-plugin"; }
    static get properties() { return { "control": { "state": true }, "customControlName": { "type": String, "attr": "custom-control-name" }, "dropDownData": { "type": "Any", "attr": "drop-down-data" }, "dropDownTitle": { "type": String, "attr": "drop-down-title" }, "getControl": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return ".export-map {\n  position: absolute;\n  right: 68px;\n  top: -44px; }\n\n.button-wrapper {\n  position: relative; }\n\n.btn-menu {\n  cursor: pointer; }\n  .btn-menu:hover {\n    background-color: #f4f4f4; }\n\n.menu {\n  list-style: none;\n  padding-left: 0;\n  width: fit-content;\n  margin: 0;\n  top: 34px;\n  display: none;\n  position: absolute;\n  box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.36); }\n\n.menu-item {\n  height: 30px;\n  padding: 0 10px;\n  white-space: nowrap;\n  border-bottom: 1px solid lightgray;\n  box-sizing: border-box;\n  background-color: white;\n  display: flex;\n  align-items: center;\n  cursor: pointer; }\n  .menu-item:last-child {\n    border-bottom: none; }\n  .menu-item:hover {\n    background-color: lightyellow; }\n\n.custom-icon {\n  width: 30px;\n  height: 30px;\n  background-repeat: no-repeat;\n  background-size: 19px 19px;\n  background-position: 50%; }\n\n.icon-kml {\n  background-image: url(\"./assets/icons/kml-icon.png\"); }\n\n.icon-shp {\n  background-image: url(\"./assets/icons/icon-shp.png\"); }\n\n.icon-csv {\n  background-image: url(\"./assets/icons/csv-icon.png\"); }\n\n.icon-pin {\n  background-image: url(\"./assets/icons/pin-icon.png\"); }\n\n.icon-heatmap {\n  background-image: url(\"./assets/icons/heatmap-icon.png\"); }\n\n.icon-cluster {\n  background-image: url(\"./assets/icons/cluster-icon.png\"); }\n\n.icon-csv,\n.icon-shp,\n.icon-kml,\n.icon-pin,\n.icon-heatmap,\n.icon-cluster {\n  width: 14px;\n  height: 14px;\n  background-size: 14px;\n  margin-right: 5px; }\n\n.export-bt {\n  background-image: url(\"./assets/icons/export-icon.png\") !important;\n  background-size: 14px 14px !important; }\n\n.settings {\n  background-image: url(\"./assets/icons/settings-icon.png\") !important;\n  background-size: 14px 14px !important; }\n\n.menu-item.custom-group {\n  display: flex;\n  flex-direction: column;\n  border-bottom: 1px solid black;\n  height: initial;\n  cursor: initial; }\n  .menu-item.custom-group:last-child {\n    border: none; }\n  .menu-item.custom-group:hover {\n    background: white; }\n\n.group-item {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  width: 100%;\n  height: 30px;\n  border-bottom: 1px solid lightgrey;\n  padding: 0 10px;\n  cursor: pointer; }\n  .group-item:last-child {\n    border: none; }\n  .group-item:hover {\n    background-color: lightyellow; }\n\n.group-item-input-label {\n  text-transform: uppercase; }\n\n.group-item-input {\n  justify-self: self-end;\n  display: flex;\n  margin-left: auto;\n  margin-right: 0;\n  outline: none; }\n"; }
}

// import _ from "lodash";
// import store from "../../../../store/store";
class CustomSettings {
    constructor() {
        this.compName = CUSTOM_SETTINGS_TAG;
    }
    getElement() {
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
                    },
                ],
            }
            : null;
        const vectorsData = {
            title: 'Vectors Data',
            itemList: [
                {
                    label: 'Cell Data Towers',
                    // iconClassName: 'icon-cluster',
                    onClick: null,
                    name: 'Cell Data Towers',
                    type: DropDownItemType.CHECK_BOX,
                    isSelected: false,
                },
            ]
        };
        console.log(vectorsData);
        const dropDownData = [coordinateSystemToolbarData, toolbarLayerSettingsConfig, vectorsData];
        const settingsDropDownData = _.filter(dropDownData, (item) => item !== null);
        // Utils.doNothing([settingsDropDownData])
        return (h("custom-drop-down-plugin", { gisMap: this.gisMap, dropDownData: settingsDropDownData, customControlName: 'settings', dropDownTitle: 'Settings' }));
    }
    componentDidLoad() {
        Utils.log_componentDidLoad(this.compName);
        this.customDropDownPluginEl = this.el.querySelector(`${CUSTOM_DROP_DOWN_PLUGIN_TAG}`);
        reaction(() => store.state.mapConfig.coordinateSystemType, coordinateSystemType => {
            this.coordinateChangeHandler(coordinateSystemType);
        });
        reaction(() => store.state.mapConfig.mode, mode => {
            this.clusterHeatChangeHandler(mode);
        });
        Utils.fitLayerControllerPosition();
    }
    coordinateChangeHandler(coordinateSystemType) {
        // Update newer check item
        this.setRadioButtonsByCheckedValue('coordinates', coordinateSystemType);
    }
    clusterHeatChangeHandler(mode) {
        // Update newer check item
        this.setRadioButtonsByCheckedValue('layers', mode);
    }
    setRadioButtonsByCheckedValue(groupName, checkedValue) {
        const groupItems = this.customDropDownPluginEl.getControl().getContainer().querySelectorAll(`.menu li.menu-item.custom-group [name="${groupName}"]`);
        _.forEach(groupItems, (input) => {
            // Unselect checked element
            if (input.getAttribute('checked')) {
                input.removeAttribute('checked');
            }
        });
        _.forEach(groupItems, (input) => {
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
    static get is() { return "custom-settings"; }
    static get properties() { return { "el": { "elementRef": true }, "getElement": { "method": true }, "gisMap": { "type": "Any", "attr": "gis-map" } }; }
    static get style() { return ""; }
}

export { CustomDropDownPlugin, CustomSettings };
